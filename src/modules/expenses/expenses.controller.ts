import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService, CreateExpenseDto, UpdateExpenseDto } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.expensesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateExpenseDto, @Request() req: any) {
    return this.expensesService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto, @Request() req: any) {
    return this.expensesService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.remove(id, req.user.userId);
  }
}
