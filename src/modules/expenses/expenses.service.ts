import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

export { CreateExpenseDto, UpdateExpenseDto };

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async findAll(farmId: string) {
    return this.prisma.expense.findMany({
      where: { farmId },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, farmId: string) {
    const expense = await this.prisma.expense.findFirst({ where: { id, farmId } });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async create(dto: CreateExpenseDto, farmId: string, userId: string) {
    const expense = await this.prisma.expense.create({
      data: {
        farmId,
        category: dto.category,
        item: dto.item,
        amount: Number(dto.amount),
        date: new Date(dto.date),
        vendor: dto.vendor,
        batchId: dto.batchId || null,
        notes: dto.notes,
      },
    });
    await this.logChange('Expense', expense.id, 'create', userId, null, expense);
    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto, farmId: string, userId: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Expense not found');
    const updated = await this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.category && { category: dto.category }),
        ...(dto.item && { item: dto.item }),
        ...(dto.amount != null && { amount: Number(dto.amount) }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.vendor !== undefined && { vendor: dto.vendor }),
        ...(dto.batchId !== undefined && { batchId: dto.batchId || null }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
    await this.logChange('Expense', id, 'update', userId, existing, updated);
    return updated;
  }

  async remove(id: string, farmId: string, userId: string) {
    const existing = await this.prisma.expense.findFirst({ where: { id, farmId } });
    if (!existing) throw new NotFoundException('Expense not found');
    await this.prisma.expense.delete({ where: { id } });
    await this.logChange('Expense', id, 'delete', userId, existing, null);
    return { success: true };
  }

  private async logChange(entityType: string, entityId: string, action: string, userId: string, before: any, after: any) {
    await this.prisma.changeLog.create({
      data: { entityType, entityId, action, userId, ...(before != null && { before }), ...(after != null && { after }) },
    });
  }
}
