import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

// Triggered externally by the frontend's Vercel Cron (see aseda-farm/app/api/cron/daily)
// rather than an in-process @Cron timer, since the API host can spin down when idle
// and an in-process timer would silently miss its schedule while asleep.
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private notificationsService: NotificationsService) {}

  async handleDailyNotifications() {
    this.logger.log('Running daily notification job...');
    try {
      await this.notificationsService.processDaily();
      this.logger.log('Daily notification job completed');
    } catch (err) {
      this.logger.error('Daily notification job failed', err);
    }
  }
}
