import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService, CreateExpenseDto, UpdateExpenseDto } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.expensesService.findAll(req.user.farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.findOne(id, req.user.farmId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  create(@Body() dto: CreateExpenseDto, @Request() req: any) {
    return this.expensesService.create(dto, req.user.farmId, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  update(@Param('id') id: string, @Body() dto: UpdateExpenseDto, @Request() req: any) {
    return this.expensesService.update(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.remove(id, req.user.farmId, req.user.userId);
  }
}
