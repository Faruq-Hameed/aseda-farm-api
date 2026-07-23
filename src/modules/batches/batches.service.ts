import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateTasksForBatch } from '../tasks/task-templates';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

export { CreateBatchDto, UpdateBatchDto };

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(farmId: string) {
    return this.prisma.batch.findMany({
      where: { farmId },
      include: {
        _count: { select: { tasks: true, activities: true, harvests: true } },
        harvests: { select: { totalRevenue: true } },
      },
      orderBy: { plantingDate: 'asc' },
    });
  }

  async findOne(id: string, farmId: string) {
    const batch = await this.prisma.batch.findFirst({
      where: { id, farmId },
      include: {
        tasks: { orderBy: { dueDate: 'asc' } },
        activities: {
          orderBy: { date: 'desc' },
          include: { user: { select: { name: true } } },
        },
        harvests: { orderBy: { harvestDate: 'desc' } },
        suckerHarvests: { orderBy: { harvestDate: 'desc' } },
      },
    });
    if (!batch) throw new NotFoundException('Batch not found');
    return batch;
  }

  async create(dto: CreateBatchDto, farmId: string, userId: string) {
    const batch = await this.prisma.batch.create({
      data: {
        farmId,
        name: dto.name,
        plantCount: Number(dto.plantCount),
        plantingDate: new Date(dto.plantingDate),
        variety: dto.variety || 'Agbagba',
        spacing: dto.spacing || '3m x 2m',
        acresCovered: dto.acresCovered ? Number(dto.acresCovered) : 0,
        status: dto.status || 'growing',
        expectedHarvestStart: dto.expectedHarvestStart ? new Date(dto.expectedHarvestStart) : undefined,
        expectedHarvestEnd: dto.expectedHarvestEnd ? new Date(dto.expectedHarvestEnd) : undefined,
        notes: dto.notes,
      },
    });

    if (dto.status !== 'planned') {
      const tasks = generateTasksForBatch(new Date(dto.plantingDate), batch.id, farmId);
      await this.prisma.task.createMany({ data: tasks });
    }

    await this.prisma.changeLog.create({ data: { entityType: 'Batch', entityId: batch.id, action: 'create', userId, after: batch } });
    return batch;
  }

  async update(id: string, dto: UpdateBatchDto, farmId: string, userId: string) {
    const batch = await this.prisma.batch.findFirst({ where: { id, farmId } });
    if (!batch) throw new NotFoundException('Batch not found');
    const { adjustmentReason, ...rest } = dto;
    const updated = await this.prisma.batch.update({
      where: { id },
      data: {
        ...rest,
        expectedHarvestStart: dto.expectedHarvestStart ? new Date(dto.expectedHarvestStart) : undefined,
        expectedHarvestEnd: dto.expectedHarvestEnd ? new Date(dto.expectedHarvestEnd) : undefined,
      },
    });

    let summary: string | undefined;
    if (dto.plantCount !== undefined && Number(dto.plantCount) !== batch.plantCount) {
      const direction = Number(dto.plantCount) > batch.plantCount ? 'increased' : 'reduced';
      summary = `Plant count ${direction} from ${batch.plantCount} to ${dto.plantCount}`;
      if (adjustmentReason) summary += `: ${adjustmentReason}`;
    }

    await this.prisma.changeLog.create({
      data: { entityType: 'Batch', entityId: id, action: 'update', userId, before: batch, after: updated, summary },
    });

    // A batch created as "planned" gets no task schedule up front; generate the standard
    // plantain schedule the moment it becomes active, same as a normal batch would at creation.
    if (batch.status === 'planned' && updated.status !== 'planned') {
      const existingTasks = await this.prisma.task.count({ where: { batchId: id } });
      if (existingTasks === 0) {
        const tasks = generateTasksForBatch(updated.plantingDate, id, farmId);
        await this.prisma.task.createMany({ data: tasks });
      }
    }

    return updated;
  }

  async getHistory(id: string, farmId: string) {
    const batch = await this.prisma.batch.findFirst({ where: { id, farmId } });
    if (!batch) throw new NotFoundException('Batch not found');
    return this.prisma.changeLog.findMany({
      where: { entityType: 'Batch', entityId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, farmId: string, userId: string) {
    const batch = await this.prisma.batch.findFirst({ where: { id, farmId } });
    if (!batch) throw new NotFoundException('Batch not found');
    await this.prisma.batch.delete({ where: { id } });
    await this.prisma.changeLog.create({ data: { entityType: 'Batch', entityId: id, action: 'delete', userId, before: batch } });
    return { success: true };
  }
}
