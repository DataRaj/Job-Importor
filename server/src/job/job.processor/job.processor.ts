import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job as BullQueueJob } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job as JobEntity } from '../schemas/jobs.schema';
import { ImportLog as LogEntity } from '../schemas/importor-log.schema';
import { ErrorHandler, LOG_MESSAGES } from '../../common';

@Processor('job-import-queue')
export class JobImportWorker {
  private readonly log = new Logger(JobImportWorker.name);

  constructor(
    @InjectModel(JobEntity.name) private readonly jobRepo: Model<JobEntity>,
    @InjectModel(LogEntity.name) private readonly logRepo: Model<LogEntity>,
  ) {}

  @Process({ name: 'import', concurrency: Number(process.env.CONCURRENCY ?? '1') })
  async processImportTask(queueJob: BullQueueJob) {
    try {
      this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.PROCESSING_JOB_IMPORT} ${queueJob.data.feedUrl}`);

      const { jobData, feedUrl } = queueJob.data;

      // Extract job details
      const jobDetails = {
        guid: jobData.guid?.[0]?._ ?? jobData.guid?.[0],
        title: jobData.title?.[0] ?? '',
        link: jobData.link?.[0] ?? '',
        description: jobData.description?.[0] ?? '',
      };

      // Retrieve or create log entry
      let importLog = await this.logRepo.findOne({ feedUrl });
      if (!importLog) {
        this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_LOG} ${feedUrl}`);
        importLog = new this.logRepo({
          feedUrl,
          timestamp: new Date(),
          totalFetched: 1,
          newJobs: 0,
          updatedJobs: 0,
          failedJobs: [],
        });
      } else {
        this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_LOG} ${feedUrl}`);
        importLog.totalFetched += 1;
        importLog.timestamp = new Date();
      }

      try {
        // Check for existing job
        const foundJob = await this.jobRepo.findOne({ guid: jobDetails.guid });

        if (foundJob) {
          this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.UPDATING_EXISTING_JOB} ${jobDetails.guid}`);
          await this.jobRepo.updateOne({ guid: jobDetails.guid }, jobDetails);
          importLog.updatedJobs += 1;
        } else {
          this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.CREATING_NEW_JOB} ${jobDetails.guid}`);
          await new this.jobRepo(jobDetails).save();
          importLog.newJobs += 1;
        }

        this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.SUCCESSFULLY_PROCESSED_JOB} ${jobDetails.title}`);
      } catch (jobErr) {
        this.log.error(
          LOG_MESSAGES.JOB_PROCESSOR.ERROR_PROCESSING_JOB
            .replace('{guid}', jobDetails.guid)
            .replace('{error}', jobErr.message)
        );
        importLog.failedJobs.push({
          reason: jobErr.message,
          jobData: jobDetails,
        });
      }

      await importLog.save();
      this.log.log(`${LOG_MESSAGES.JOB_PROCESSOR.IMPORT_LOG_SAVED} ${feedUrl}`);
    } catch (err) {
      this.log.error(LOG_MESSAGES.JOB_PROCESSOR.ERROR_IN_PROCESSOR.replace('{error}', err.message));
      ErrorHandler.handleServiceError(err, 'processImportTask');
    }
  }
}
