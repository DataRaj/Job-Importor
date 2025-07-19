import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { JobService } from './job.service';
import { JobProcessor } from './job.processor/job.processor';
import { ImportLog, ImportLogSchema } from './schemas/importor-log.schema';
import { Job, JobSchema } from './schemas/jobs.schema';
import { JobController } from './job.controller';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'job-import-queue' }),
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: ImportLog.name, schema: ImportLogSchema },
    ]),
  ],
  providers: [JobService, JobProcessor],
  controllers: [JobController],
})
export class JobModule {}
