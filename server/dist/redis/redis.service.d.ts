import { RedisClientType } from 'redis';
export declare class RedisService {
    private readonly redisClient;
    constructor(redisClient: RedisClientType);
    setUserOnline(userId: string, username: string): Promise<void>;
    removeOnlineUser(userId: string): Promise<void>;
    getAllOnlineUsers(): Promise<{
        userId: string;
        username: string;
    }[]>;
    isUserOnline(userId: string): Promise<boolean>;
}
