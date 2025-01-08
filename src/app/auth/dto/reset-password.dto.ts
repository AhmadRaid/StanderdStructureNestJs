// reset-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  token: string;
}