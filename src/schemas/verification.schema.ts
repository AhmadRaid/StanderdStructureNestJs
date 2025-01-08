// verification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Verification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  admin: Types.ObjectId;

  @Prop({ required: true, type: String })
  verificationCode: string;

  @Prop({ type: Date, default: Date.now, expires: 180 }) // TTL index of 3 minutes (180 seconds)
  createdAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
