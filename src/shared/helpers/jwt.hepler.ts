import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJWTService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly RECOVERY_SECRET = process.env.RECOVERY_SECRET;
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
  private readonly RECOVERY_EXPIRES_IN = process.env.RECOVERY_EXPIRES_IN;

  createAccessToken(payload: any): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN,
    });
  }

  createRecoverToken(payload: any): string {
    return jwt.sign(payload, this.RECOVERY_SECRET, {
      expiresIn: this.RECOVERY_EXPIRES_IN,
    });
  }

  // Verify the access token (returns the decoded token or throws an error if invalid)
  verifyIdToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  // Verify the recovery token (returns the decoded token or throws an error if invalid)
  verifyRecoverToken(token: string): any {
    try {
      return jwt.verify(token, this.RECOVERY_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired recovery token');
    }
  }
}
