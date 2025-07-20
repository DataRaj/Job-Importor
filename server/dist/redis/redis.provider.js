"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisProvider = exports.REDIS_CLIENT = void 0;
const redis_1 = require("redis");
const config_1 = require("@nestjs/config");
exports.REDIS_CLIENT = 'REDIS_CLIENT';
exports.RedisProvider = {
    provide: exports.REDIS_CLIENT,
    inject: [config_1.ConfigService],
    useFactory: async (configService) => {
        const client = (0, redis_1.createClient)({ url: process.env.REDIS_CONNECT_URL || configService.get('REDIS_CONNECT_URL') });
        client.on('error', (err) => {
            console.error(' Redis client error:', err);
        });
        await client.connect();
        console.log('Redis client connected');
        return client;
    },
};
//# sourceMappingURL=redis.provider.js.map