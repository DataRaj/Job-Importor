import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Message extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Group' })
    groupId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    sender: Types.ObjectId;

    @Prop()
    content: string;

    @Prop()
    edited: boolean;

    @Prop()
    mediaUrl?: string;
    
    createdAt?: Date;
    updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

