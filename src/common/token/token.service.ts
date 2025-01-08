// token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { TokenBlacklist } from 'src/schemas/token-blacklist.schema';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenBlacklist.name)
    private tokenBlacklistModel: Model<TokenBlacklist>,
  ) {}

  async blacklistToken(token: string, expiresAt: Date) {
    try{
    return await this.tokenBlacklistModel.create({ token, expiresAt });
    }catch(error:any){
      return error
    }
  }
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenEntry = await this.tokenBlacklistModel.findOne({ token });
    return !!tokenEntry;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    await this.tokenBlacklistModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}
