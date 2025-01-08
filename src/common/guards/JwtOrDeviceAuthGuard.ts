import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { TokenService } from '../token/token.service';

@Injectable()
export class JwtOrDeviceAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenService: TokenService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headers = request.headers;
    const authHeader = headers.authorization;
    const deviceId = headers['device-id'];

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (!token) throw new UnauthorizedException('Token not found');

      const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);
      if (isBlacklisted)
        throw new UnauthorizedException('Token is blacklisted');

      try {
        const payload = this.jwtService.verify(token);

        const user = await this.userModel.findById(payload.ـid);

        if (!user) throw new UnauthorizedException('User not found');
        request.user = user;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }

    if (deviceId) {
      request['deviceId'] = deviceId;
      return true;
    }

    throw new UnauthorizedException(
      'Unauthorized: Token or Device ID required',
    );
  }
}
