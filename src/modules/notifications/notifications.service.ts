import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async findAll(userId: string, limit?: number) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: limit }),
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
    return { success: true };
  }

  async remove(id: string, userId: string) {
    await this.prisma.notification.deleteMany({ where: { id, userId } });
    return { success: true };
  }

  async removeAll(userId: string) {
    await this.prisma.notification.deleteMany({ where: { userId } });
    return { success: true };
  }

  async create(data: { userId: string; taskId?: string; title: string; message: string; type: string }) {
    return this.prisma.notification.create({ data });
  }

  async processDaily() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const users = await this.prisma.user.findMany({ include: { farm: true } });

    for (const user of users) {
      if (!user.farm) continue;

      const settings = await this.prisma.notificationSetting.findUnique({
        where: { userId: user.id },
      });
      const daysBefore = settings?.emailDaysBefore ?? 3;

      // Reminder emails for upcoming tasks
      for (const days of [1, 3, 7].filter((d) => d <= daysBefore || d === 1)) {
        const target = new Date(today);
        target.setDate(target.getDate() + days);
        const next = new Date(target);
        next.setDate(next.getDate() + 1);

        const tasks = await this.prisma.task.findMany({
          where: {
            farmId: user.farm.id,
            dueDate: { gte: target, lt: next },
            status: { in: ['pending', 'in_progress'] },
          },
          include: { batch: true },
        });

        for (const task of tasks) {
          const already = await this.prisma.notification.findFirst({
            where: {
              userId: user.id,
              taskId: task.id,
              type: 'task_due',
              createdAt: { gte: new Date(Date.now() - 86400000) },
            },
          });
          if (already) continue;

          await this.create({
            userId: user.id,
            taskId: task.id,
            title: `Task due in ${days} day${days !== 1 ? 's' : ''}: ${task.title}`,
            message: `${task.title} is due on ${task.dueDate.toLocaleDateString('en-NG')}${task.batch ? ` (${task.batch.name})` : ''}`,
            type: 'task_due',
          });

          if (settings?.emailEnabled !== false) {
            await this.email.sendTaskReminder({
              to: user.email,
              taskTitle: task.title,
              taskCategory: task.category,
              dueDate: task.dueDate.toLocaleDateString('en-NG'),
              batchName: task.batch?.name || 'Farm-wide',
              product: task.product ?? undefined,
              quantity: task.quantity ?? undefined,
              description: task.description ?? undefined,
              daysUntilDue: days,
            });
          }
        }
      }

      // Mark overdue
      await this.prisma.task.updateMany({
        where: {
          farmId: user.farm.id,
          dueDate: { lt: today },
          status: { in: ['pending', 'in_progress'] },
        },
        data: { status: 'overdue' },
      });

      const overdueTasks = await this.prisma.task.findMany({
        where: { farmId: user.farm.id, status: 'overdue' },
        include: { batch: true },
        take: 20,
      });

      for (const task of overdueTasks) {
        if (settings?.overdueAlerts === false) continue;
        const already = await this.prisma.notification.findFirst({
          where: {
            userId: user.id,
            taskId: task.id,
            type: 'task_overdue',
            createdAt: { gte: new Date(Date.now() - 86400000) },
          },
        });
        if (already) continue;
        const daysOverdue = Math.floor((today.getTime() - task.dueDate.getTime()) / 86400000);
        await this.create({
          userId: user.id,
          taskId: task.id,
          title: `Overdue: ${task.title}`,
          message: `${task.title} is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
          type: 'task_overdue',
        });
      }

      // Daily digest
      if (settings?.dailyDigest !== false && settings?.emailEnabled !== false) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const [todaysTasks, upcomingTasks] = await Promise.all([
          this.prisma.task.findMany({
            where: { farmId: user.farm.id, dueDate: { gte: today, lt: tomorrow }, status: { in: ['pending', 'in_progress'] } },
            include: { batch: true },
          }),
          this.prisma.task.findMany({
            where: { farmId: user.farm.id, dueDate: { gte: tomorrow, lt: nextWeek }, status: { in: ['pending', 'in_progress'] } },
            include: { batch: true },
          }),
        ]);

        await this.email.sendDailyDigest({
          to: user.email,
          todaysTasks,
          overdueTasks,
          upcomingTasks,
          date: today.toLocaleDateString('en-NG'),
        });
      }
    }
  }
}
