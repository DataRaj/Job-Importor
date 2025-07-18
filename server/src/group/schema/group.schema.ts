import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({
    type: {
      content: { type: String },
      msgType: { type: String },
      createdAt: { type: Date },
    }
  })
  lastMessage: {
    content: string;
    msgType: string; 
    createdAt: Date;
  };


}

export const GroupSchema = SchemaFactory.createForClass(Group);
