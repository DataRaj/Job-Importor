import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { ImportLog } from './schemas/importor-log.schema';
import { GetImportLogsQueryDto } from './dto/import-log.dto';
export declare class JobService {
    private jobQueue;
    private logModel;
    private readonly logger;
    constructor(jobQueue: Queue, logModel: Model<ImportLog>);
    fetchAndQueueJobs(): Promise<void>;
    getImportLogs(query: GetImportLogsQueryDto): Promise<{
        logs: (import("mongoose").FlattenMaps<ImportLog> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    removeAllJobs(): Promise<void>;
}
