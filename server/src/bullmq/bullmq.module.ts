import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from 'src/auth/auth.module';
import { ChatModule } from 'src/chat/chat.module';
import { GroupModule } from 'src/group/group.module';
import { MessageService } from './queues/message.queue';
import { MessageConsumer } from './consumers/message.consumer';
import { GlobalModule } from 'src/common/global.module';
import { NotificationService } from './queues/notification.queue';
import { NotificationConsumer } from './consumers/notification.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'redis-12114.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12114,
        password: 'ARntialLgwVFTgJijJnm6F8Cxzf58nRK',
      },
    }),
    AuthModule,
    forwardRef(() => GlobalModule),
    forwardRef(() => ChatModule),
    GroupModule,
    BullModule.registerQueue(
      {
        name: 'message',
      },
      {
        name: 'notification',
      },
    ),
  ],
  providers: [MessageService, MessageConsumer, NotificationService, NotificationConsumer],
  exports: [MessageService, NotificationService],
})
export class BullmqModule { }
