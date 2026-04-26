import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private notificationsService: NotificationsService) {}

  @Cron('0 7 * * *') // Every day at 7:00 AM
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
