import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImportLog } from './schemas/importor-log.schema';
import { GetImportLogsQueryDto } from './dto/import-log.dto';
import { ErrorHandler, LOG_MESSAGES } from '../common';

const FEEDS = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm',
];

@Injectable()
export class JobService {
  private readonly logger = new Logger(JobService.name);
  constructor(
    @InjectQueue('job-import-queue') private jobQueue: Queue,
    @InjectModel(ImportLog.name) private logModel: Model<ImportLog>,
  ) {}

  @Cron('0 * * * *')
  async fetchAndQueueJobs() {
    this.logger.log(LOG_MESSAGES.JOB_SERVICE.START_SCHEDULED_IMPORT);
    
    for (const feed of FEEDS) {
      try {
        this.logger.log(`${LOG_MESSAGES.JOB_SERVICE.FETCHING_FEED} ${feed}`);
        
        const response = await axios.get(feed);
        const result = await parseStringPromise(response.data);
        const jobs = result.rss.channel[0].item;

        this.logger.log(LOG_MESSAGES.JOB_SERVICE.FOUND_JOBS.replace('{count}', jobs.length.toString()).replace('{feed}', feed));

        for (const job of jobs) {
          await this.jobQueue.add(
            'import',
            {
              feedUrl: feed,
              jobData: job,
            },
            {
              attempts: parseInt(process.env.ATTEMPTS || '3', 10),             
              backoff: {
                type: 'exponential',   
                delay: parseInt(process.env.BACKOFF_DELAY || '5000', 10)            
              },
              removeOnComplete: true,
              removeOnFail: false,
            }
          );
        }
        

        this.logger.log(LOG_MESSAGES.JOB_SERVICE.SUCCESSFULLY_QUEUED.replace('{count}', jobs.length.toString()).replace('{feed}', feed));
      } catch (error) {
        this.logger.error(LOG_MESSAGES.JOB_SERVICE.ERROR_PROCESSING_FEED.replace('{feed}', feed).replace('{error}', error.message));
        
        if (axios.isAxiosError(error)) {
          if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            this.logger.error(LOG_MESSAGES.JOB_SERVICE.NETWORK_ERROR.replace('{feed}', feed).replace('{error}', error.message));
          } else if (error.response?.status! >= 400) {
            // @ts-ignore
            this.logger.error(LOG_MESSAGES.JOB_SERVICE.HTTP_ERROR.replace('{status}', error.response?.status!.toString()).replace('{feed}', feed).replace('{error}', error.message));
          }
        } else if (error.name === 'ValidationError') {
          this.logger.error(LOG_MESSAGES.JOB_SERVICE.XML_PARSING_ERROR.replace('{feed}', feed).replace('{error}', error.message));
        }
        
        continue;
      }
    }
    
    this.logger.log(LOG_MESSAGES.JOB_SERVICE.COMPLETED_SCHEDULED_IMPORT);
  }

  async getImportLogs(query: GetImportLogsQueryDto) {
    try {
      this.logger.log(`${LOG_MESSAGES.JOB_SERVICE.FETCHING_LOGS} ${JSON.stringify(query)}`);
      
      const { page = 1, limit = 10, feedUrl } = query;

      const filter: any = {};
      if (feedUrl) {
        filter.feedUrl = { $regex: feedUrl, $options: 'i' }; 
      }

      const skip = (page - 1) * limit;

      const [logs, total] = await Promise.all([
        this.logModel
          .find(filter)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.logModel.countDocuments(filter).exec()
      ]);

      const totalPages = Math.ceil(total / limit);

      this.logger.log(LOG_MESSAGES.JOB_SERVICE.SUCCESSFULLY_FETCHED_LOGS.replace('{count}', logs.length.toString()).replace('{total}', total.toString()));

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        }
      };
    } catch (error) {
      this.logger.error(LOG_MESSAGES.JOB_SERVICE.ERROR_IN_GET_LOGS.replace('{error}', error.message));
      ErrorHandler.handleDatabaseError(error, 'getImportLogs');
    }
  }
  async removeAllJobs() {
    try {
      this.logger.log('Removing all jobs from the queue');
      const result = await this.logModel.deleteMany({});
      await this.jobQueue.drain();
      this.logger.log(`All jobs removed successfully: ${result.deletedCount} jobs deleted`);
    } catch (error) {
      this.logger.error(`Error removing jobs: ${error.message}`);
      ErrorHandler.handleServiceError(error, 'removeAllJobs');
      
    }
  } 

}