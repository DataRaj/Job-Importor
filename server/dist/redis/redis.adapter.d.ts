import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    private adapterConstructor;
    connectToRedis(): Promise<void>;
    createIOServer(port: number, options?: ServerOptions): any;
}
