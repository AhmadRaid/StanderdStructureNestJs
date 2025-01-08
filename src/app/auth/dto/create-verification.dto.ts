// dto/create-verification.dto.ts
import { IsNotEmpty, IsString, IsBoolean, IsDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVerificationDto {
  @IsNotEmpty()
  readonly adminId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly verificationCode: string;

}
