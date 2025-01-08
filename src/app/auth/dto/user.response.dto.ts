import { IsPhoneNumber } from 'class-validator';

export class UserResponseDto {
  _id: string;
  @IsPhoneNumber(null, {
    message:
      'The phoneNumber must be a valid international phone number starting with a "+" followed by the country code and real, valid phone number.',
  })
  phoneNumber: string;
  fullName: string | null;
  userName: string | null;
  email: string | null;
  image: string | null;
  status: string;
  role: string;

  constructor(user) {
    this._id = user._id;
    this.phoneNumber = user.phoneNumber;
    this.fullName = user.fullName ? user.fullName : null;
    this.userName = user.userName ? user.userName : null;
    this.email = user.email ? user.email : null;
    this.image = user.image ? user.image : null;
    this.status = user.status;
    this.role = user.role;
  }
}
