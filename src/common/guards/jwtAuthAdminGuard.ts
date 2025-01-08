import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { TokenService } from '../token/token.service';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n'; // Import the translation service
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/admins.schema';
import { AdminRole } from '../enum/adminRole.enum';

@Injectable()
export class JwtAuthAdminGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly reflector: Reflector,
    private readonly i18n: I18nService, // Inject translation service
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request.headers.authorization);

    await this.validateTokenNotBlacklisted(token);

    const decoded = this.verifyToken(token);

    const admin = await this.findAdminById(decoded.ـid);

    request.user = admin;

    await this.validateAdminRole(context, admin);

    return true;
  }

  private extractTokenFromHeader(authorization?: string): string {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        this.i18n.t('auth.errors.missingOrInvalidHeader'),
      );
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        this.i18n.t('auth.errors.tokenNotFound'),
      );
    }

    return token;
  }

  private async validateTokenNotBlacklisted(token: string): Promise<void> {
    const isBlacklisted = await this.tokenService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException(
        this.i18n.t('auth.errors.tokenBlacklisted'),
      );
    }
  }

  private verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException(
        this.i18n.t('auth.errors.invalidToken'),
      );
    }
  }

  private async findAdminById(adminId: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ _id: adminId });
    if (!admin) {
      throw new UnauthorizedException(
        this.i18n.t('auth.errors.adminNotFound'),
      );
    }
    return admin;
  }

  private async validateAdminRole(
    context: ExecutionContext,
    admin: Admin,
  ): Promise<void> {
    const roles = this.reflector.get<AdminRole[]>(
      'roles',
      context.getHandler(),
    );

    if (roles && !roles.includes(admin.role)) {
      throw new UnauthorizedException(
        await this.i18n.t('auth.errors.roleUnauthorized', {
          args: { roles: roles.join(', ') },
        }),
      );
    }
    
  }
}
