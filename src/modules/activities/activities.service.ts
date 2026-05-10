import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

export { CreateActivityDto, UpdateActivityDto };

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(farmId: string, batchId?: string, type?: string, limit?: number) {
    return this.prisma.activityLog.findMany({
      where: {
        farmId,
        ...(batchId && { batchId }),
        ...(type && { type }),
      },
      include: {
        batch: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
      ...(limit && { take: limit }),
    });
  }

  async findOne(id: string, farmId: string) {
    const activity = await this.prisma.activityLog.findFirst({
      where: { id, farmId },
      include: {
        batch: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async create(dto: CreateActivityDto, farmId: string, userId: string) {
    const activity = await this.prisma.activityLog.create({
      data: {
        farmId,
        batchId: dto.batchId || null,
        userId,
        type: dto.type,
        title: dto.title,
        description: dto.description,
        product: dto.product,
        quantity: dto.quantity,
        cost: dto.cost != null && dto.cost !== ('' as any) ? Number(dto.cost) : null,
        plantCount: dto.plantCount != null && dto.plantCount !== ('' as any) ? Number(dto.plantCount) : null,
        date: dto.date ? new Date(dto.date) : new Date(),
        photos: dto.photos || [],
        weather: dto.weather,
      },
    });
    await this.logChange('ActivityLog', activity.id, 'create', userId, null, activity);
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto, farmId: string, userId: string) {
    const existing = await this.prisma.activityLog.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Activity not found');

    const updated = await this.prisma.activityLog.update({
      where: { id },
      data: {
        ...(dto.type && { type: dto.type }),
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.batchId !== undefined && { batchId: dto.batchId || null }),
        ...(dto.product !== undefined && { product: dto.product }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.cost != null && { cost: Number(dto.cost) }),
        ...(dto.plantCount != null && { plantCount: Number(dto.plantCount) }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.weather !== undefined && { weather: dto.weather }),
        ...(dto.photos !== undefined && { photos: dto.photos }),
      },
    });
    await this.logChange('ActivityLog', id, 'update', userId, existing, updated);
    return updated;
  }

  async remove(id: string, farmId: string, userId: string) {
    const existing = await this.prisma.activityLog.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Activity not found');
    await this.prisma.activityLog.delete({ where: { id } });
    await this.logChange('ActivityLog', id, 'delete', userId, existing, null);
    return { success: true };
  }

  private async logChange(entityType: string, entityId: string, action: string, userId: string, before: any, after: any) {
    await this.prisma.changeLog.create({
      data: { entityType, entityId, action, userId, ...(before != null && { before }), ...(after != null && { after }) },
    });
  }
}
