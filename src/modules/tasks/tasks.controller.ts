import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService, CreateTaskDto, UpdateTaskDto, CompleteTaskDto, TaskFilterDto } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Request() req: any, @Query() filter: TaskFilterDto) {
    return this.tasksService.findAll(req.user.farmId, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.findOne(id, req.user.farmId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  create(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(dto, req.user.farmId, req.user.userId);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req: any) {
    return this.tasksService.update(id, dto, req.user.farmId, req.user.userId);
  }

  @Post(':id/complete')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER', 'WORKER')
  complete(@Param('id') id: string, @Body() dto: CompleteTaskDto, @Request() req: any) {
    return this.tasksService.complete(id, dto, req.user.farmId, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('OWNER', 'MANAGER')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.remove(id, req.user.farmId, req.user.userId);
  }
}
