import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CompleteTaskDto } from './dto/complete-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';

export { CreateTaskDto, UpdateTaskDto, CompleteTaskDto, TaskFilterDto };

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(farmId: string, filter: TaskFilterDto = {}) {
    return this.prisma.task.findMany({
      where: {
        farmId,
        ...(filter.status && { status: filter.status }),
        ...(filter.category && { category: filter.category }),
        ...(filter.batchId && { batchId: filter.batchId }),
        ...(filter.priority && { priority: filter.priority }),
      },
      include: { batch: { select: { id: true, name: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(id: string, farmId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, farmId },
      include: { batch: true },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto, farmId: string, userId: string) {
    const task = await this.prisma.task.create({
      data: {
        farmId,
        batchId: dto.batchId || null,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority || 'medium',
        dueDate: new Date(dto.dueDate),
        product: dto.product,
        quantity: dto.quantity,
        cost: dto.cost != null && dto.cost !== ('' as any) ? Number(dto.cost) : null,
        notes: dto.notes,
        isRecurring: dto.isRecurring || false,
        recurEvery: dto.recurEvery ? Number(dto.recurEvery) : null,
      },
    });
    await this.prisma.changeLog.create({ data: { entityType: 'Task', entityId: task.id, action: 'create', userId, after: task } });
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, farmId: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, farmId } });
    if (!task) throw new NotFoundException('Task not found');
    const updated = await this.prisma.task.update({
      where: { id },
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined },
    });
    await this.prisma.changeLog.create({ data: { entityType: 'Task', entityId: id, action: 'update', userId, before: task, after: updated } });
    return updated;
  }

  async complete(id: string, dto: CompleteTaskDto, farmId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const task = await this.prisma.task.findFirst({
      where: { id, farmId },
      include: { batch: true },
    });
    if (!task) throw new NotFoundException('Task not found');

    const completedAt = dto.completedAt ? new Date(dto.completedAt) : new Date();
    const actualCost = dto.actualCost != null && dto.actualCost !== ('' as any) ? Number(dto.actualCost) : null;

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt,
        completedBy: user?.name,
        cost: actualCost ?? task.cost,
        notes: dto.notes || task.notes,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        farmId,
        batchId: task.batchId,
        userId,
        type: task.category,
        title: task.title,
        description: dto.notes || task.description || `Completed: ${task.title}`,
        product: task.product,
        quantity: task.quantity,
        cost: actualCost ?? (task.cost ? Number(task.cost) : undefined),
        date: completedAt,
        photos: [],
        weather: dto.weather,
      },
    });

    if (task.isRecurring && task.recurEvery) {
      const nextDue = new Date(task.dueDate);
      nextDue.setDate(nextDue.getDate() + task.recurEvery);
      await this.prisma.task.create({
        data: {
          farmId,
          batchId: task.batchId,
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          dueDate: nextDue,
          product: task.product,
          quantity: task.quantity,
          cost: task.cost,
          isRecurring: true,
          recurEvery: task.recurEvery,
        },
      });
    }

    return updated;
  }

  async remove(id: string, farmId: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id, farmId } });
    if (!task) throw new NotFoundException('Task not found');
    await this.prisma.task.delete({ where: { id } });
    await this.prisma.changeLog.create({ data: { entityType: 'Task', entityId: id, action: 'delete', userId, before: task } });
    return { success: true };
  }

  async markOverdue(farmId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await this.prisma.task.updateMany({
      where: { farmId, dueDate: { lt: today }, status: { in: ['pending', 'in_progress'] } },
      data: { status: 'overdue' },
    });
  }
}
