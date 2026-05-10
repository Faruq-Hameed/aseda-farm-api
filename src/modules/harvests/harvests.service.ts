import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

export { CreateHarvestDto, UpdateHarvestDto };

@Injectable()
export class HarvestsService {
  constructor(private prisma: PrismaService) {}

  async findBunchHarvests(farmId: string) {
    return this.prisma.harvest.findMany({
      where: { farmId },
      include: { batch: { select: { id: true, name: true } } },
      orderBy: { harvestDate: 'desc' },
    });
  }

  async findSuckerHarvests(farmId: string) {
    return this.prisma.suckerHarvest.findMany({
      where: { batch: { farmId } },
      include: { batch: { select: { id: true, name: true } } },
      orderBy: { harvestDate: 'desc' },
    });
  }

  async findOneBunch(id: string, farmId: string) {
    const harvest = await this.prisma.harvest.findFirst({ where: { id, farmId }, include: { batch: { select: { id: true, name: true } } } });
    if (!harvest) throw new NotFoundException('Harvest not found');
    return harvest;
  }

  async findOneSucker(id: string, farmId: string) {
    const harvest = await this.prisma.suckerHarvest.findFirst({ where: { id, batch: { farmId } }, include: { batch: { select: { id: true, name: true } } } });
    if (!harvest) throw new NotFoundException('Sucker harvest not found');
    return harvest;
  }

  async createBunchHarvest(dto: CreateHarvestDto, farmId: string, userId: string) {
    const bunchCount = dto.bunchCount ? Number(dto.bunchCount) : 0;
    const pricePerBunch = dto.pricePerBunch ? Number(dto.pricePerBunch) : null;
    const avgBunchWeight = dto.avgBunchWeight ? Number(dto.avgBunchWeight) : null;
    const totalRevenue = pricePerBunch && bunchCount ? pricePerBunch * bunchCount : null;
    const totalWeight = avgBunchWeight && bunchCount ? avgBunchWeight * bunchCount : null;

    const harvest = await this.prisma.harvest.create({
      data: {
        farmId,
        batchId: dto.batchId,
        harvestDate: new Date(dto.harvestDate),
        bunchCount,
        avgBunchWeight,
        totalWeight,
        pricePerBunch,
        totalRevenue,
        buyer: dto.buyer,
        channel: dto.channel,
        notes: dto.notes,
      },
    });
    await this.logChange('Harvest', harvest.id, 'create', userId, null, harvest);
    return harvest;
  }

  async createSuckerHarvest(dto: CreateHarvestDto, farmId: string, userId: string) {
    const suckerCount = dto.suckerCount ? Number(dto.suckerCount) : 0;
    const soldCount = dto.soldCount ? Number(dto.soldCount) : 0;
    const pricePerSucker = dto.pricePerSucker ? Number(dto.pricePerSucker) : null;
    const replantedCount = dto.replantedCount ? Number(dto.replantedCount) : 0;
    const revenue = soldCount && pricePerSucker
      ? soldCount * pricePerSucker
      : (dto.revenue ? Number(dto.revenue) : null);

    const harvest = await this.prisma.suckerHarvest.create({
      data: {
        batchId: dto.batchId,
        harvestDate: new Date(dto.harvestDate),
        suckerCount,
        method: dto.method!,
        soldCount,
        pricePerSucker,
        revenue,
        replantedCount,
        notes: dto.notes,
      },
    });
    await this.logChange('SuckerHarvest', harvest.id, 'create', userId, null, harvest);
    return harvest;
  }

  async updateBunch(id: string, dto: UpdateHarvestDto, farmId: string, userId: string) {
    const existing = await this.prisma.harvest.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Harvest not found');

    const bunchCount = dto.bunchCount != null ? Number(dto.bunchCount) : existing.bunchCount;
    const pricePerBunch = dto.pricePerBunch != null ? Number(dto.pricePerBunch) : existing.pricePerBunch;
    const avgBunchWeight = dto.avgBunchWeight != null ? Number(dto.avgBunchWeight) : existing.avgBunchWeight;
    const totalRevenue = pricePerBunch && bunchCount ? pricePerBunch * bunchCount : existing.totalRevenue;
    const totalWeight = avgBunchWeight && bunchCount ? avgBunchWeight * bunchCount : existing.totalWeight;

    const updated = await this.prisma.harvest.update({
      where: { id },
      data: {
        ...(dto.harvestDate && { harvestDate: new Date(dto.harvestDate) }),
        bunchCount,
        avgBunchWeight,
        totalWeight,
        pricePerBunch,
        totalRevenue,
        ...(dto.buyer !== undefined && { buyer: dto.buyer }),
        ...(dto.channel !== undefined && { channel: dto.channel }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
    await this.logChange('Harvest', id, 'update', userId, existing, updated);
    return updated;
  }

  async updateSucker(id: string, dto: UpdateHarvestDto, farmId: string, userId: string) {
    const existing = await this.prisma.suckerHarvest.findFirst({ where: { id, batch: { farmId } } });
    if (!existing) throw new NotFoundException('Sucker harvest not found');

    const soldCount = dto.soldCount != null ? Number(dto.soldCount) : existing.soldCount ?? 0;
    const pricePerSucker = dto.pricePerSucker != null ? Number(dto.pricePerSucker) : existing.pricePerSucker;
    const revenue = soldCount && pricePerSucker ? soldCount * pricePerSucker : (dto.revenue != null ? Number(dto.revenue) : existing.revenue);

    const updated = await this.prisma.suckerHarvest.update({
      where: { id },
      data: {
        ...(dto.harvestDate && { harvestDate: new Date(dto.harvestDate) }),
        ...(dto.suckerCount != null && { suckerCount: Number(dto.suckerCount) }),
        ...(dto.method && { method: dto.method }),
        soldCount,
        pricePerSucker,
        revenue,
        ...(dto.replantedCount != null && { replantedCount: Number(dto.replantedCount) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
    await this.logChange('SuckerHarvest', id, 'update', userId, existing, updated);
    return updated;
  }

  async removeBunch(id: string, farmId: string, userId: string) {
    const existing = await this.prisma.harvest.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Harvest not found');
    await this.prisma.harvest.delete({ where: { id } });
    await this.logChange('Harvest', id, 'delete', userId, existing, null);
    return { success: true };
  }

  async removeSucker(id: string, farmId: string, userId: string) {
    const existing = await this.prisma.suckerHarvest.findFirst({ where: { id, batch: { farmId } } });
    if (!existing) throw new NotFoundException('Sucker harvest not found');
    await this.prisma.suckerHarvest.delete({ where: { id } });
    await this.logChange('SuckerHarvest', id, 'delete', userId, existing, null);
    return { success: true };
  }

  private async logChange(entityType: string, entityId: string, action: string, userId: string, before: any, after: any) {
    await this.prisma.changeLog.create({
      data: { entityType, entityId, action, userId, ...(before != null && { before }), ...(after != null && { after }) },
    });
  }
}
