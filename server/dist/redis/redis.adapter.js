"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    adapterConstructor;
    async connectToRedis() {
        const pubClient = (0, redis_1.createClient)({ url: process.env.REDIS_CONNECT_URL || this.configService.get('REDIS_CONNECT_URL') });
        const subClient = pubClient.duplicate();
        try {
            await Promise.all([pubClient.connect(), subClient.connect()]);
            this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient);
            console.log(' Redis connected successfully');
        }
        catch (error) {
            console.error(' Redis connection failed:', error);
            throw error;
        }
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis.adapter.js.map