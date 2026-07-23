import { Controller, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  // Called by the frontend's Vercel Cron once a day. Guarded by a shared secret
  // instead of JwtAuthGuard since the caller is a machine, not a logged-in user.
  @Post('trigger-daily')
  async triggerDaily(@Headers('x-cron-secret') secret?: string) {
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      throw new UnauthorizedException();
    }
    await this.schedulerService.handleDailyNotifications();
    return { triggered: true };
  }
}
