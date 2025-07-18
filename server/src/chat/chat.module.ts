import { forwardRef, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { GroupModule } from 'src/group/group.module';
import { GlobalModule } from 'src/common/global.module';
import { BullmqModule } from 'src/bullmq/bullmq.module';
import { MessagePref, MessagePrefSchema } from './schema/messagepref.schema';
import { Group, GroupSchema } from 'src/group/schema/group.schema';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: MessagePref.name, schema: MessagePrefSchema },
    ]),
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    AuthModule,
    GroupModule,
    forwardRef(() => GlobalModule),
    forwardRef(() => BullmqModule),
    RedisModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
