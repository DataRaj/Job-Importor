import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    // const redisUrl = configService.get<string>('REDIS_URL');
    const client = createClient({ url: 'redis://default:ARntialLgwVFTgJijJnm6F8Cxzf58nRK@redis-12114.c264.ap-south-1-1.ec2.redns.redis-cloud.com:12114' });

    client.on('error', (err) => {
      console.error(' Redis client error:', err); 
    });  

    await client.connect();
    console.log('Redis client connected');
    return client;
  },
};
