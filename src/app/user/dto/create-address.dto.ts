import { IsString, IsOptional, IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsPhoneNumber(null) // Assumes international format. Adjust according to your phone number validation needs.
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postcode: string;
}
