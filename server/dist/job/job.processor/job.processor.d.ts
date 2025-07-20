import { Job as BullJob } from 'bull';
import { Model } from 'mongoose';
import { Job } from '../schemas/jobs.schema';
import { ImportLog } from '../schemas/importor-log.schema';
export declare class JobProcessor {
    private jobModel;
    private logModel;
    private readonly logger;
    constructor(jobModel: Model<Job>, logModel: Model<ImportLog>);
    handleJobImport(job: BullJob): Promise<void>;
}
