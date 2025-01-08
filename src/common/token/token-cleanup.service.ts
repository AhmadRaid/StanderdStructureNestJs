// token-cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenBlacklist } from 'src/schemas/token-blacklist.schema';

@Injectable()
export class TokenCleanupService {
  constructor(
    @InjectModel(TokenBlacklist.name)
    private tokenBlacklistModel: Model<TokenBlacklist>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredTokens() {
    await this.tokenBlacklistModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}
