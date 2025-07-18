import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class NotificationService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async queueNotification(data: any) {
    await this.notificationQueue.add('send-notification', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: 1000,
    });
  }
}
