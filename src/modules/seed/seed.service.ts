import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateTasksForBatch } from '../tasks/task-templates';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    const hashed = await bcrypt.hash('aseda2026', 12);

    const user = await this.prisma.user.upsert({
      where: { email: 'admin@asedafarm.ng' },
      update: {},
      create: {
        name: 'ASEDA Farm Admin',
        email: 'admin@asedafarm.ng',
        password: hashed,
        role: 'OWNER',
      },
    });

    await this.prisma.notificationSetting.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const farm = await this.prisma.farm.upsert({
      where: { ownerId: user.id },
      update: {},
      create: {
        name: 'ASEDA Farm',
        location: 'Adesiyan Village, Olojuoro Road (after Olomi), Ibadan, Oyo State',
        totalAcres: 5.0,
        ownerId: user.id,
      },
    });

    // Ensure the admin user has a FarmMember record as OWNER
    await this.prisma.farmMember.upsert({
      where: { farmId_userId: { farmId: farm.id, userId: user.id } },
      update: {},
      create: { farmId: farm.id, userId: user.id, role: 'OWNER', addedById: user.id },
    });

    const batch1PlantingDate = new Date('2026-04-21');
    const batch1 = await this.prisma.batch.upsert({
      where: { id: 'batch-1-aseda' },
      update: {},
      create: {
        id: 'batch-1-aseda',
        farmId: farm.id,
        name: 'Batch 1',
        plantCount: 680,
        plantingDate: batch1PlantingDate,
        variety: 'Agbagba',
        spacing: '3m x 2m',
        acresCovered: 1.02,
        status: 'growing',
        expectedHarvestStart: new Date('2027-04-21'),
        expectedHarvestEnd: new Date('2027-07-21'),
        notes: 'First commercial planting. 680 suckers sourced locally.',
      },
    });

    const existingTasks = await this.prisma.task.count({ where: { batchId: batch1.id } });
    if (existingTasks === 0) {
      const tasks = generateTasksForBatch(batch1PlantingDate, batch1.id, farm.id);
      await this.prisma.task.createMany({ data: tasks });
    }

    await this.prisma.batch.upsert({
      where: { id: 'batch-2-aseda' },
      update: {},
      create: {
        id: 'batch-2-aseda',
        farmId: farm.id,
        name: 'Batch 2',
        plantCount: 800,
        plantingDate: new Date('2026-07-15'),
        variety: 'Agbagba',
        spacing: '3m x 2m',
        acresCovered: 1.2,
        status: 'planned',
        expectedHarvestStart: new Date('2027-07-15'),
        expectedHarvestEnd: new Date('2027-10-15'),
        notes: 'Planned planting July-August 2026.',
      },
    });

    const expensesCount = await this.prisma.expense.count({ where: { farmId: farm.id } });
    if (expensesCount === 0) {
      await this.prisma.expense.createMany({
        data: [
          { farmId: farm.id, category: 'suckers', item: '680 plantain suckers (Agbagba variety)', amount: 136000, date: new Date('2026-04-21'), vendor: 'Local sucker supplier', batchId: batch1.id, notes: '680 suckers @ N200 each' },
          { farmId: farm.id, category: 'labour', item: 'Land preparation and planting labour', amount: 40000, date: new Date('2026-04-15'), vendor: 'Farm labour team', batchId: batch1.id },
        ],
      });
    }

    return { success: true, message: 'Database seeded successfully' };
  }
}
