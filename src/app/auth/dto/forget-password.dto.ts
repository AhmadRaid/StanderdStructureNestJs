// change-password.dto.ts
import { IsString, MinLength } from 'class-validator';

export class resetPasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
