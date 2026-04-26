import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SettingsService, UpdateSettingsDto } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get()
  get(@Request() req: any) {
    return this.settingsService.get(req.user.userId);
  }

  @Put()
  update(@Body() dto: UpdateSettingsDto, @Request() req: any) {
    return this.settingsService.update(req.user.userId, dto);
  }
}
