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

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    const existingToken = await this.tokenBlacklistModel.findOne({ userId });

    if (existingToken) {
      // Update the existing token
      existingToken.token = token;
      existingToken.updatedAt = new Date();
      await existingToken.save();
    } else {
      // Create a new token entry
      const newToken = new this.tokenBlacklistModel({ userId, token, createdAt: new Date() });
      await newToken.save();
    }
  }

  async isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
    const storedToken = await this.tokenBlacklistModel.findOne({ userId, token });

    return !!storedToken;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    await this.tokenBlacklistModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}
