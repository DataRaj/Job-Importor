import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class User extends Document {
    @Prop({ required: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true, unique: true })
    email: string
}

export const UserSchema = SchemaFactory.createForClass(User)