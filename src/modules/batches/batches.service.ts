import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateTasksForBatch } from '../tasks/task-templates';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

export { CreateBatchDto, UpdateBatchDto };

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const farm = await this.getFarm(userId);
    return this.prisma.batch.findMany({
      where: { farmId: farm.id },
      include: {
        _count: { select: { tasks: true, activities: true, harvests: true } },
        harvests: { select: { totalRevenue: true } },
      },
      orderBy: { plantingDate: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const farm = await this.getFarm(userId);
    const batch = await this.prisma.batch.findFirst({
      where: { id, farmId: farm.id },
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

  async create(dto: CreateBatchDto, userId: string) {
    const farm = await this.getFarm(userId);
    const batch = await this.prisma.batch.create({
      data: {
        farmId: farm.id,
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
      const tasks = generateTasksForBatch(new Date(dto.plantingDate), batch.id, farm.id);
      await this.prisma.task.createMany({ data: tasks });
    }

    return batch;
  }

  async update(id: string, dto: UpdateBatchDto, userId: string) {
    const farm = await this.getFarm(userId);
    const batch = await this.prisma.batch.findFirst({ where: { id, farmId: farm.id } });
    if (!batch) throw new NotFoundException('Batch not found');
    const updated = await this.prisma.batch.update({
      where: { id },
      data: {
        ...dto,
        expectedHarvestStart: dto.expectedHarvestStart ? new Date(dto.expectedHarvestStart) : undefined,
        expectedHarvestEnd: dto.expectedHarvestEnd ? new Date(dto.expectedHarvestEnd) : undefined,
      },
    });
    await this.prisma.changeLog.create({ data: { entityType: 'Batch', entityId: id, action: 'update', userId, before: batch, after: updated } });
    return updated;
  }

  async remove(id: string, userId: string) {
    const farm = await this.getFarm(userId);
    const batch = await this.prisma.batch.findFirst({ where: { id, farmId: farm.id } });
    if (!batch) throw new NotFoundException('Batch not found');
    await this.prisma.batch.delete({ where: { id } });
    await this.prisma.changeLog.create({ data: { entityType: 'Batch', entityId: id, action: 'delete', userId, before: batch, after: undefined } });
    return { success: true };
  }

  private async getFarm(userId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { ownerId: userId } });
    if (!farm) throw new NotFoundException('No farm found for this user');
    return farm;
  }
}
