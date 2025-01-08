import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpAuthDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly fullName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly userName: string;
}
