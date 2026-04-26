import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService, CreateTaskDto, UpdateTaskDto, CompleteTaskDto, TaskFilterDto } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Request() req: any, @Query() filter: TaskFilterDto) {
    return this.tasksService.findAll(req.user.userId, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: any) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Request() req: any) {
    return this.tasksService.update(id, dto, req.user.userId);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteTaskDto, @Request() req: any) {
    return this.tasksService.complete(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.tasksService.remove(id, req.user.userId);
  }
}
