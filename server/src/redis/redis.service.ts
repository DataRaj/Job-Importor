import { Inject, Injectable } from '@nestjs/common';
import { use } from 'passport';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: RedisClientType,
  ) {}

  async setUserOnline(userId: string, username: string) {
    await this.redisClient.hSet(`onlineUsers:${userId}`, {
      userId,
      username,
    });
  }

  async removeOnlineUser(userId: string) {
    await this.redisClient.del(`onlineUsers:${userId}`);
  }

  async getAllOnlineUsers(): Promise<{ userId: string; username: string }[]> {
    const keys = await this.redisClient.keys('onlineUsers:*');
    const users: any = [];
    for (const key of keys) {
      const userData = await this.redisClient.hGetAll(key);
      if (userData?.userId && userData?.username) {
        users.push({
          userId: userData.userId,
          username: userData.username,
        });
      }
    }

    return users;
  }

  async isUserOnline(userId: string): Promise<boolean> {
    return (await this.redisClient.exists(`onlineUsers:${userId}`)) === 1;
  }
}
