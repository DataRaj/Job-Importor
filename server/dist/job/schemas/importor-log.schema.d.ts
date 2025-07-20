import { Document } from 'mongoose';
export declare class ImportLog extends Document {
    feedUrl: string;
    timestamp: Date;
    totalFetched: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: Array<{
        reason: string;
        jobData?: any;
        timestamp?: Date;
    }>;
}
export declare const ImportLogSchema: import("mongoose").Schema<ImportLog, import("mongoose").Model<ImportLog, any, any, any, Document<unknown, any, ImportLog, any> & ImportLog & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ImportLog, Document<unknown, {}, import("mongoose").FlatRecord<ImportLog>, {}> & import("mongoose").FlatRecord<ImportLog> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
