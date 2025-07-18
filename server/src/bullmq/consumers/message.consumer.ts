import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { GlobalGateway } from 'src/common/global.gateway';
import { AuthService } from 'src/auth/auth.service';
import { GroupService } from 'src/group/group.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Processor('message')
@Injectable()
export class MessageConsumer extends WorkerHost {
  constructor(
    private readonly chatService: ChatService,
    private readonly globalGateway: GlobalGateway,
    private readonly userService: AuthService,
    private readonly groupService: GroupService,
    private readonly chatGateway: ChatGateway,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    switch (job.name) {
      case 'send-message':
        return this.handleSendMessage(job);
      case 'update-delivered':
        return this.handleUpdateDelivered(job);
      case 'update-seen':
        return this.handleUpdateSeen(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async handleSendMessage(job: Job<any>): Promise<any> {
    const { groupId, content, sender, mediaUrl } = job.data;

    try {
      const savedMessage = await this.chatService.createMessage(job.data);
      // console.log(savedMessage,'saved msggg');
      // const updateMessagePrefSchema=await this.chatService.updateMessageDelivery(savedMessage._id)
      const userInfo = await this.userService.getUserInfo(sender);
      if (savedMessage) {
        const messageWithUserInfo = {
          id: savedMessage._id,
          groupId,
          content,
          sender: userInfo,
          timestamp: new Date(savedMessage.createdAt as any).toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          ),
          createdAt: savedMessage.createdAt,
          image: mediaUrl,
        };
        // console.log(messageWithUserInfo,'message with user info');
        this.chatGateway.server
          .to(groupId)
          .emit('msgreceive', messageWithUserInfo);

        const lastMessageData = {
          groupId,
          lastMessage: {
            content,
            sender: userInfo,
            timestamp: savedMessage.createdAt,
          },
        };

        this.globalGateway.emitToUsers(
          await this.groupService.getGroupMemberIds(groupId),
          'latestMessageUpdate',
          lastMessageData,
        );

        return { status: 'message-sent', messageId: savedMessage._id };
      }
    } catch (error) {
      console.error('Error processing send-message job:', error);
      throw error;
    }
  }

  private async handleUpdateDelivered(job: Job<string>): Promise<any> {
    const userId = job.data;

    try {
      await this.chatService.updateMessageDelivery(userId);
      return { status: 'delivery-updated', userId };
    } catch (error) {
      console.error('Error processing update-delivered job:', error);
      throw error;
    }
  }

  private async handleUpdateSeen(job: Job<{userId:string,roomId:string}>): Promise<any> {
    const {userId,roomId}=job.data
    try {
      await this.chatService.updateMessageSeen(userId,roomId)
      return { status: 'seen-updated'};
    } catch (error) {
      console.error('Error processing update-seen job:', error);
      throw error;
    }
  }
}
