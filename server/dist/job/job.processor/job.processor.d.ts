import { Job as BullQueueJob } from 'bull';
import { Model } from 'mongoose';
import { Job as JobEntity } from '../schemas/jobs.schema';
import { ImportLog as LogEntity } from '../schemas/importor-log.schema';
export declare class JobImportWorker {
    private readonly jobRepo;
    private readonly logRepo;
    private readonly log;
    constructor(jobRepo: Model<JobEntity>, logRepo: Model<LogEntity>);
    processImportTask(queueJob: BullQueueJob): Promise<void>;
}
