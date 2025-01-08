// token.module.ts
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from './token.service';
import {
  TokenBlacklist,
  TokenBlacklistSchema,
} from 'src/schemas/token-blacklist.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenBlacklist.name, schema: TokenBlacklistSchema },
    ]),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
