import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService, CreateActivityDto, UpdateActivityDto } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('batchId') batchId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ) {
    return this.activitiesService.findAll(req.user.userId, batchId, type, limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.activitiesService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateActivityDto, @Request() req: any) {
    return this.activitiesService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Request() req: any) {
    return this.activitiesService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.activitiesService.remove(id, req.user.userId);
  }
}
