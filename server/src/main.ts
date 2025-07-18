import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { RedisIoAdapter } from "./redis/redis.adapter";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
 
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  const port = configService.get<number>('PORT') ?? 3001;
  console.log(`server running on port http://localhost:${port}`);
  
  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(port);  
}

bootstrap();