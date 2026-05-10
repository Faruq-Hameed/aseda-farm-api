import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private email: EmailService,
  ) {}

  async findAll(userId: string, limit = 50) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markRead(id: string, userId: string) {
    // Verify ownership before updating
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) return { success: false };
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
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

    // Process all farms, sending notifications to every member of each farm
    const farms = await this.prisma.farm.findMany({
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    for (const farm of farms) {
      await this.processFarm(farm, today);
    }
  }

  private async processFarm(farm: any, today: Date) {
    const settings = await this.prisma.notificationSetting.findFirst({
      where: { userId: farm.ownerId },
    });
    const daysBefore = settings?.emailDaysBefore ?? 3;

    // Mark tasks overdue for this farm
    await this.prisma.task.updateMany({
      where: {
        farmId: farm.id,
        dueDate: { lt: today },
        status: { in: ['pending', 'in_progress'] },
      },
      data: { status: 'overdue' },
    });

    const overdueTasks = await this.prisma.task.findMany({
      where: { farmId: farm.id, status: 'overdue' },
      include: { batch: true },
      take: 20,
    });

    // Send notifications to each farm member
    for (const membership of farm.members) {
      const user = membership.user;
      const userSettings = await this.prisma.notificationSetting.findUnique({ where: { userId: user.id } });

      // Task due reminders
      for (const days of [1, 3, 7].filter((d) => d <= daysBefore || d === 1)) {
        const target = new Date(today);
        target.setDate(target.getDate() + days);
        const next = new Date(target);
        next.setDate(next.getDate() + 1);

        const tasks = await this.prisma.task.findMany({
          where: {
            farmId: farm.id,
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

          if (userSettings?.emailEnabled !== false) {
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

      // Overdue alerts
      for (const task of overdueTasks) {
        if (userSettings?.overdueAlerts === false) continue;
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

      // Daily digest — only send when there is something worth reporting
      if (userSettings?.dailyDigest !== false && userSettings?.emailEnabled !== false) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const [todaysTasks, upcomingTasks] = await Promise.all([
          this.prisma.task.findMany({
            where: { farmId: farm.id, dueDate: { gte: today, lt: tomorrow }, status: { in: ['pending', 'in_progress'] } },
            include: { batch: true },
          }),
          this.prisma.task.findMany({
            where: { farmId: farm.id, dueDate: { gte: tomorrow, lt: nextWeek }, status: { in: ['pending', 'in_progress'] } },
            include: { batch: true },
          }),
        ]);

        // Skip empty digests — only send when there is actionable content
        if (todaysTasks.length > 0 || overdueTasks.length > 0 || upcomingTasks.length > 0) {
          await this.email.sendDailyDigest({
            to: user.email,
            todaysTasks,
            overdueTasks,
            upcomingTasks,
            date: today.toLocaleDateString('en-NG'),
          }).catch((err) => this.logger.error(`Failed to send digest to ${user.email}`, err));
        }
      }
    }
  }
}
