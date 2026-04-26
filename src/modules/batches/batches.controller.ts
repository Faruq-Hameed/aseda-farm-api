import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BatchesService, CreateBatchDto, UpdateBatchDto } from './batches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('batches')
@UseGuards(JwtAuthGuard)
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.batchesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.batchesService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateBatchDto, @Request() req: any) {
    return this.batchesService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBatchDto, @Request() req: any) {
    return this.batchesService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.batchesService.remove(id, req.user.userId);
  }
}
