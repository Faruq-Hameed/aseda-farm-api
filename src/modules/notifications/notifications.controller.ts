import { Controller, Get, Post, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(@Request() req: any, @Query('limit') limit?: string) {
    return this.notificationsService.findAll(req.user.userId, limit ? parseInt(limit) : 50);
  }

  @Post(':id/read')
  markRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markRead(id, req.user.userId);
  }

  @Put('read-all')
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  // 'all' must come BEFORE ':id' so it is not swallowed by the parameterised route
  @Delete('all')
  removeAll(@Request() req: any) {
    return this.notificationsService.removeAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.remove(id, req.user.userId);
  }
}
