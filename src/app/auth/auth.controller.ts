import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from '../../interfaces/AuthRequest';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  Req,
  UseGuards,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthAdminGuard } from 'src/common/guards/jwtAuthAdminGuard';
import { resetPasswordDto } from './dto/forget-password.dto';
import { SignUpAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtAuthGuard';
import { NewPasswordDto } from './dto/new-password.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { TokenService } from 'src/common/token/token.service';
import { JwtOrDeviceRequest } from 'src/interfaces/JwtOrDeviceRequest';
import { JwtOrDeviceAuthGuard } from 'src/common/guards/JwtOrDeviceAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  create(@Body() singUpAuthDto: SignUpAuthDto) {
    return this.authService.create(singUpAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto,@Req() req:Request) {
    const deviceId = req.headers['device-id'];
    return this.authService.login(loginAuthDto,deviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  resetPassword(
    @Req() req: AuthRequest,
    @Body() resetPassword: resetPasswordDto,
  ) {
    return this.authService.resetPassword(req.user._id, resetPassword);
  }

  @Post('check-email-send-code')
  forgetPassword(@Body() ForgetPasswordBody: ForgetPasswordDto) {
    return this.authService.forgetPassword(ForgetPasswordBody);
  }

  @Post('check-verification-code')
  verifyCode(@Body() verifyCodeDto: { userId: string; code: string }) {
    const { userId, code } = verifyCodeDto;
    return this.authService.verifyCode(userId, code);
  }

  @Post('generate-password')
  generatePassword(@Body() ForgetPasswordBody: NewPasswordDto) {
    return this.authService.generatePassword(ForgetPasswordBody);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token not provided' });

    const decodedToken = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decodedToken.exp * 1000);
    try {
      await this.tokenService.blacklistToken(token, expiresAt);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ message: 'Logout failed' });
    }
  }

  // @UseGuards(JwtOrDeviceAuthGuard)
  // @Get('increase-view')
  // increaseView(@Req() req: JwtOrDeviceRequest) {
  //   return this.authService.increaseViewCount(req);
  // }
}
