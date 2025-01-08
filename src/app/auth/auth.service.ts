import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { SignUpAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { resetPasswordDto } from './dto/resetPassword.dto';
import { Verification } from 'src/schemas/verification.schema';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    private jwtService: JwtService,
  ) {}

  async create(loginAuthDto: SignUpAuthDto) {
    const { fullName, userName, email, password } = loginAuthDto;

    const existingEmailUser = await this.userModel.findOne({
      email,
      isDeleted: false,
    });

    if (existingEmailUser) {
      throw new BadRequestException('EMAIL_EXIST');
    }

    const existingUserNameUser = await this.userModel.findOne({
      userName,
      isDeleted: false,
    });

    if (existingUserNameUser) {
      throw new BadRequestException('USER_NAME_EXIST');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      fullName,
      userName,
    });

    await newUser.save();

    return {
      message: 'USER.CREATED',
    };
  }

  async login(loginAuthDto: LoginAuthDto, deviceId: string) {
    const { email, password } = loginAuthDto;

    const user = await this.userModel.findOne({
      $or: [{ email: email }, { userName: email }],
      isDeleted: false,
    });

    if (!user) {
      throw new UnauthorizedException('USER.NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('auth.errors.INVALIDE_INCREDENTIAL');
    }

    const payload = { email: user.email, ـid: user._id, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: new UserResponseDto(user),
    };
  }

  async resetPassword(userId: string, resetPassword: resetPasswordDto) {
    const { currentPassword, newPassword } = resetPassword;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }

    // Compare the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('PASSWORD.CURRNET_PASSWROD_NOT_CORRECT');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return { message: 'PASSWORD.UPDATED' };
  }

  // Method for changing password when current password is unknown
  async generatePassword(generatePassword: NewPasswordDto) {
    const { userId, newPassword } = generatePassword;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return { message: 'PASSWORD.UPDATED' };
  }

  // Method for changing password when current password is known
  async forgetPassword(ForgetPasswordBody: ForgetPasswordDto) {
    const { email } = ForgetPasswordBody;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('EMAIL_EXIST');
    }
    this.generateVerificationCode(user._id);

    return {
      userId: user._id,
      message: 'VERIFICATION.SEND_CODE',
    };
  }

  // Verify a code
  async verifyCode(userId: string, verificationCode: string) {
    const verification = await this.verificationModel.findOne({
      user: new Types.ObjectId(userId),
    });

    if (!verification) {
      throw new NotFoundException(
        "VERIFICATION.VERIFICATION_TIMEOUT",
      );
    }

    // Check if the verification code is correct
    const isMatch = await bcrypt.compare(
      verificationCode,
      verification.verificationCode,
    );

    if (!isMatch) {
      throw new BadRequestException('VERIFICATION.VERIFICATION_CODE_NOT_CORRECT');
    }

    return { message: 'VERIFICATION.VERIFICATION_SUCCEFULL' };
  }

  // Generate a hashed verification code
  async generateVerificationCode(userId: any): Promise<{ code: string }> {
    //    const code = Math.random().toString(36).substring(2, 8); // Generate a random code
    const code = '12345';
    const hashedCode = await bcrypt.hash(code, 10);

    const verification = new this.verificationModel({
      user: userId,
      verificationCode: hashedCode,
    });

    await verification.save();
    console.log(verification);

    return { code: '12345' }; // Return the plain code (send this via email/SMS)
  }

  //  async increaseViewCount(req: any) {
  //   const now = new Date();
  //   const currentMonth = now.getMonth();
  //   const currentYear = now.getFullYear();
  //   const userId = req.user?._id;
  //   const deviceId = req.deviceId;
  //   let existingVisitor;

  //   if (userId) {
  //     existingVisitor = await this.visitorModel.findOne({
  //       userId,
  //       visitDate: {
  //         $gte: new Date(currentYear, currentMonth, 1),
  //         $lt: new Date(currentYear, currentMonth + 1, 1),
  //       },
  //     });
  //   } else if (deviceId) {
  //     existingVisitor = await this.visitorModel.findOne({
  //       deviceId,
  //       visitDate: {
  //         $gte: new Date(currentYear, currentMonth, 1),
  //         $lt: new Date(currentYear, currentMonth + 1, 1),
  //       },
  //     });
  //   }

  //   if (existingVisitor) {
  //     return null;
  //   }

  //   const visitor = new this.visitorModel({
  //     visitDate: new Date(),
  //     userId: userId || null,
  //     deviceId: deviceId || null,
  //   });

  //   return visitor.save();
  // }
}
