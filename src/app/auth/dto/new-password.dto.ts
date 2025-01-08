// forget-password.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDto {

  @IsString()
  userId: string
  
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
