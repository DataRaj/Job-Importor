import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

import type { Provider } from '@nestjs/common';

export const RedisProvider: Provider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    // console.log('Connecting to Redis...')
    const client = createClient({ url: process.env.REDIS_CONNECT_URL || configService.get<string>('REDIS_CONNECT_URL') });
    client.on('error', (err) => {
      console.error(' Redis client error:', err); 
    });  
    await client.connect();
    console.log('Redis client connected');
    return client;
  },
};
