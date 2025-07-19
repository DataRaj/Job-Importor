import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Job extends Document {
  @Prop({ required: true, unique: true })
  guid: string;

  @Prop()
  title: string;

  @Prop()
  link: string;

  @Prop()
  description: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);