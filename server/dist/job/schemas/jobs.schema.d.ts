import { Document } from 'mongoose';
export declare class Job extends Document {
    guid: string;
    title: string;
    link: string;
    description: string;
}
export declare const JobSchema: import("mongoose").Schema<Job, import("mongoose").Model<Job, any, any, any, Document<unknown, any, Job, any> & Job & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Job, Document<unknown, {}, import("mongoose").FlatRecord<Job>, {}> & import("mongoose").FlatRecord<Job> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
