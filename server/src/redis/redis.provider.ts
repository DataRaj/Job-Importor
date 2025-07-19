import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import type { Provider } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const client = createClient({ url: process.env.REDIS_CONNECT_URL || configService.get<string>('REDIS_CONNECT_URL') });
    client.on('error', (err) => {
      console.error(' Redis client error:', err); 
    });  
    await client.connect();
    console.log('Redis client connected');
    return client;
  },
};
