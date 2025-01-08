import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {


  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
