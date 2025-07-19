import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job as BullJob } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../schemas/jobs.schema';
import { ImportLog } from '../schemas/importor-log.schema';
import { ErrorHandler, LOG_MESSAGES } from '../../common';

@Processor('job-import-queue')
export class JobProcessor {
  private readonly logger = new Logger(JobProcessor.name);

  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(ImportLog.name) private logModel: Model<ImportLog>,
  ) {}

  @Process({name: 'import', concurrency: parseInt(process.env.CONCURRENCY || '1', 10)})
  async handleJobImport(job: BullJob) {
    try {
      this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.PROCESSING_JOB_IMPORT} ${job.data.feedUrl}`);
      
      const { jobData, feedUrl } = job.data;

      const parsedJob = {
        guid: jobData.guid?.[0]?._ || jobData.guid?.[0],  
        title: jobData.title?.[0] || '',
        link: jobData.link?.[0] || '',
        description: jobData.description?.[0] || '',
      };
      
  
      let log = await this.logModel.findOne({ feedUrl });
      if (!log) {
        this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_LOG} ${feedUrl}`);
        log = new this.logModel({
          feedUrl,
          timestamp: new Date(),
          totalFetched: 1,
          newJobs: 0,
          updatedJobs: 0,
          failedJobs: []
        });
      } else {
        this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_LOG} ${feedUrl}`);
        log.totalFetched += 1;
        log.timestamp = new Date();
      }

      try {
    
        const existing = await this.jobModel.findOne({ guid: parsedJob.guid });
        
        if (existing) {
          this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_JOB} ${parsedJob.guid}`);
          await this.jobModel.updateOne({ guid: parsedJob.guid }, parsedJob);
          log.updatedJobs += 1;
        } else {
          this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_JOB} ${parsedJob.guid}`);
          await new this.jobModel(parsedJob).save();
          log.newJobs += 1;
        }
        
        this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.SUCCESSFULLY_PROCESSED_JOB} ${parsedJob.title}`);
      } catch (jobError) {
        this.logger.error(LOG_MESSAGES.JOB_PROCESSOR.ERROR_PROCESSING_JOB.replace('{guid}', parsedJob.guid).replace('{error}', jobError.message));
        log.failedJobs.push({ 
          reason: jobError.message, 
          jobData: parsedJob 
        });
      }

      await log.save();
      this.logger.log(`${LOG_MESSAGES.JOB_PROCESSOR.IMPORT_LOG_SAVED} ${feedUrl}`);
      
    } catch (error) {
      this.logger.error(LOG_MESSAGES.JOB_PROCESSOR.ERROR_IN_PROCESSOR.replace('{error}', error.message));
      ErrorHandler.handleServiceError(error, 'handleJobImport');
    }
  }
}
