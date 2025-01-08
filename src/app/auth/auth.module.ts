import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Verification, VerificationSchema } from 'src/schemas/verification.schema';
import { TokenModule } from 'src/common/token/token.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Verification.name, schema: VerificationSchema },
    ]),
    JwtModule.register({
      secret: 'TRUST4d2f8b56932d',
      signOptions: { expiresIn: '90d' },
    }),
    TokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule, MongooseModule],
})
export class AuthModule {}
