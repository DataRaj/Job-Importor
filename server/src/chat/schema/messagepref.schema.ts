import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MessagePref extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Message', required: true })
  messageId: string;

  @Prop({ type: Types.ObjectId, ref: 'Message', required: true })
  ownerId: string;

  @Prop({ type: Types.ObjectId, ref: 'Group'})
  groupId: string;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  readAt?: Date;
}

export const MessagePrefSchema = SchemaFactory.createForClass(MessagePref);

MessagePrefSchema.index({ messageId: 1, ownerId: 1 }, { unique: true });
