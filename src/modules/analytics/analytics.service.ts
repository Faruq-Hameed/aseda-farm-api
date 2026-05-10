import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(farmId: string) {
    const farm = await this.prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) throw new NotFoundException('No farm found');

    const [harvests, expenses, tasks, batches, suckerHarvests] = await Promise.all([
      this.prisma.harvest.findMany({ where: { farmId }, orderBy: { harvestDate: 'asc' } }),
      this.prisma.expense.findMany({ where: { farmId } }),
      this.prisma.task.findMany({ where: { farmId } }),
      this.prisma.batch.findMany({ where: { farmId } }),
      this.prisma.suckerHarvest.findMany({ where: { batch: { farmId } } }),
    ]);

    const totalRevenue = harvests.reduce((s, h) => s + (h.totalRevenue || 0), 0);
    const totalSuckerRevenue = suckerHarvests.reduce((s, sh) => s + (sh.revenue || 0), 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    // Include sucker revenue in net profit calculation
    const netProfit = totalRevenue + totalSuckerRevenue - totalExpenses;
    const totalPlants = batches.reduce((s, b) => s + b.plantCount, 0);

    const monthlyRevenue: Record<string, number> = {};
    for (const h of harvests) {
      const key = `${h.harvestDate.getFullYear()}-${String(h.harvestDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (h.totalRevenue || 0);
    }
    const revenueByMonth = Object.entries(monthlyRevenue).sort().map(([month, revenue]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
      revenue,
    }));

    const expenseByCategory: Record<string, number> = {};
    for (const e of expenses) {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    }

    const revenueByChannel: Record<string, number> = {};
    for (const h of harvests) {
      const ch = h.channel || 'other';
      revenueByChannel[ch] = (revenueByChannel[ch] || 0) + (h.totalRevenue || 0);
    }

    const taskStatus = {
      completed: tasks.filter((t) => t.status === 'completed').length,
      overdue: tasks.filter((t) => t.status === 'overdue').length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    };

    return {
      summary: {
        totalRevenue,
        totalSuckerRevenue,
        totalExpenses,
        netProfit,
        roi: totalExpenses > 0 ? parseFloat(((netProfit / totalExpenses) * 100).toFixed(1)) : 0,
        revenuePerPlant: totalPlants > 0 ? parseFloat((totalRevenue / totalPlants).toFixed(2)) : 0,
        costPerPlant: totalPlants > 0 ? parseFloat((totalExpenses / totalPlants).toFixed(2)) : 0,
        totalPlants,
        totalBunches: harvests.reduce((s, h) => s + h.bunchCount, 0),
        activeBatches: batches.filter((b) => b.status === 'growing' || b.status === 'harvesting').length,
      },
      charts: {
        revenueByMonth,
        expenseByCategory: Object.entries(expenseByCategory).map(([name, value]) => ({ name, value })),
        revenueByChannel: Object.entries(revenueByChannel).map(([name, value]) => ({ name, value })),
        taskStatus,
      },
    };
  }
}
