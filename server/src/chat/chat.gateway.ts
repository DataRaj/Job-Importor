import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Jwt from 'jsonwebtoken';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageService } from 'src/bullmq/queues/message.queue';
import { AuthService } from 'src/auth/auth.service';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  namespace: /^\/chat-\w+$/,
  transports: ['websocket'],
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: SocketIOServer;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
    private readonly userService: AuthService,
    private readonly redisService: RedisService,

  ) { }

  afterInit(server: SocketIOServer) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    const namespace = client.nsp;
    console.log(`Client connected to namespace: ${namespace.name}`);
    const token = client.handshake?.auth?.token;
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('jwt secret is not defined in environment');
    }
    const decoded = Jwt.verify(token, jwtSecret);
    const userId = (decoded as Jwt.JwtPayload).userId as string;
    client.data.userId = userId;
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from ${client.nsp.name}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
    const userId = client.data?.userId;
    await this.messageService.updateMessageSeen(userId, roomId);
    const userData = await this.userService.getUserInfo(userId);
    this.server.to(roomId).emit('messageSeenUpdate', {
      groupId: roomId,
      readBy: userData?.username,
    });
  }
  catch(err) { }

  @SubscribeMessage('sendmsg')
  async handleSendMessage(
    @MessageBody()
    data: {
      groupId: string;
      content: string;
      sender: string;
      mediaUrl?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const groupId = data.groupId
      await this.messageService.queueMessage(data);
      const userId = client.data?.userId;
      const onlineUsers = await this.redisService.getAllOnlineUsers();
      const otherOnlineUsers = onlineUsers.filter(
        (user) => user.userId !== userId,
      );
      for (const userr of otherOnlineUsers) {
        await this.messageService.updateMessageDelivery(userr.userId);
        client.emit('messageDeliveredUpdate', {
          groupId,
          deliveredTo: userr.username,
        })
      }

      console.log(otherOnlineUsers, 'otehr users')
    } catch (err) {
      console.error('Failed to save or emit message:', err);
    }
  }

  @SubscribeMessage('editMsg')
  async handleEditMessage(
    @MessageBody()
    data: {
      content: string;
      messageId: string;
      groupId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { content, messageId, groupId } = data;

    try {
      const editedMsg = await this.chatService.editMessage(messageId, content);
      client.nsp.to(groupId).emit('editmsgrecieve', editedMsg);
    } catch (error) {
      console.error('Failed to edit message:', error);
    }
  }

  @SubscribeMessage('messageSeen')
  async handleMessageSeen(
    @MessageBody()
    data: {
      groupId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data?.userId;
      await this.messageService.updateMessageSeen(userId, data.groupId);
      const userData = await this.userService.getUserInfo(userId);
      this.server.to(data.groupId).emit('messageSeenUpdate', {
        groupId: data.groupId,
        readBy: userData?.username,
      });
    } catch (err) {
      console.error('Failed to save or emit message:', err);
    }
  }
}
