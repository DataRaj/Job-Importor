import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { RedisIoAdapter } from "./redis/redis.adapter";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`server running on port http://localhost:${process.env.PORT || 3001}`);
  const configService = app.get(ConfigService);
  
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
 
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  
  const port = process.env.PORT ?? 3001;

  app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(port);  
}

bootstrap();
