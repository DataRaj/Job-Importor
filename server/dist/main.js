"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const redis_adapter_1 = require("./redis/redis.adapter");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log(`server running on port http://localhost:${process.env.PORT || 3001}`);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    });
    const redisIoAdapter = new redis_adapter_1.RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    const port = process.env.PORT ?? 3001;
    app.useWebSocketAdapter(redisIoAdapter);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map