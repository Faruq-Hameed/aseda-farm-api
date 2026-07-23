import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BatchesService, CreateBatchDto, UpdateBatchDto } from './batches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.batchesService.findAll(req.user.farmId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.batchesService.findOne(id, req.user.farmId);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string, @Request() req: any) {
    return this.batchesService.getHistory(id, req.user.farmId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  create(@Body() dto: CreateBatchDto, @Request() req: any) {
    return this.batchesService.create(dto, req.user.farmId, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  update(@Param('id') id: string, @Body() dto: UpdateBatchDto, @Request() req: any) {
    return this.batchesService.update(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.batchesService.remove(id, req.user.farmId, req.user.userId);
  }
}
