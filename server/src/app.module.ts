import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JobModule } from './job/job.module';
import { url } from 'inspector';
import { BullModule } from '@nestjs/bull';

@Module({
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),    

  //   MongooseModule.forRootAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     useFactory: async (configService: ConfigService) => ({
  //       uri: process.env.MONGO_URI || configService.get<string>('MONGO_URI'),
  //     }),
  //   }),
  //   // AuthModule,
  //   // GroupModule,
  //   // ChatModule,
  //   // GlobalModule, 
  //   // BullmqModule, RedisModule,
  //   ScheduleModule.forRoot(),
  //   JobModule,
  // ],

    imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
            },
    }),
    ScheduleModule.forRoot(),
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { 
}
