import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  timestamps: true, 
  collection: 'import_logs'
})
export class ImportLog extends Document {
  @Prop({ 
    required: true, 
    type: String,
    trim: true,
    maxlength: 500 
  })
  feedUrl: string;

  @Prop({ 
    required: true, 
    type: Date,
    default: Date.now,
    index: true 
  })
  timestamp: Date;

  @Prop({ 
    type: Number, 
    default: 0,
    min: 0 
  })
  totalFetched: number;

  @Prop({ 
    type: Number, 
    default: 0,
    min: 0 
  })
  newJobs: number;

  @Prop({ 
    type: Number, 
    default: 0,
    min: 0 
  })
  updatedJobs: number;

  @Prop({ 
    type: Array, 
    default: [],
    validate: {
      validator: function(failedJobs: any[]) {
        return Array.isArray(failedJobs);
      },
      message: 'Failed jobs must be an array'
    }
  })
  failedJobs: Array<{
    reason: string;
    jobData?: any;
    timestamp?: Date;
  }>;
}

export const ImportLogSchema = SchemaFactory.createForClass(ImportLog);
