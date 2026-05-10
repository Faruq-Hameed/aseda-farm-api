import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ActivitiesService, CreateActivityDto, UpdateActivityDto } from './activities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

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
    return this.activitiesService.findAll(req.user.farmId, batchId, type, limit ? parseInt(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.activitiesService.findOne(id, req.user.farmId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  create(@Body() dto: CreateActivityDto, @Request() req: any) {
    return this.activitiesService.create(dto, req.user.farmId, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Request() req: any) {
    return this.activitiesService.update(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.activitiesService.remove(id, req.user.farmId, req.user.userId);
  }
}
