import { IsOptional, IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsPhoneNumber(null) // You can specify a locale if needed, e.g., 'US'
  phoneNumber?: string;

  @IsOptional()
  @IsString() // Assuming image is a URL or file path in string format
  image?: string;
}
