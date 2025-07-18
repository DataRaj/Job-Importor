import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MessageService {
  constructor(@InjectQueue('message') private messageQueue: Queue) {}

  async queueMessage(data: any) {
    await this.messageQueue.add('send-message', data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: 1000,
    });
  }

  async updateMessageDelivery(userId: string) {
   const job= await this.messageQueue.add('update-delivered', userId, {
      attempts: 3,
      removeOnComplete: true,
      backoff: 1000,
    });
  }

  async updateMessageSeen(userId: string,roomId:string) {
    await this.messageQueue.add('update-seen',{userId,roomId}, {
      attempts: 3,
      removeOnComplete: true,
      backoff: 1000,
    });
  }
}
