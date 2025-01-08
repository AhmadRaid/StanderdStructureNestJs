// import {
//   Injectable,
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
// } from '@nestjs/common';
// import { AuthService } from 'src/app/auth/auth.service';

// @Injectable()
// export class VerifyCodeGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const verificationCode = request.body.verificationCode;
//     const userId = request.body.userId || request.body.vendorId;

//     const isValid = await this.authService.verifyCode(userId, verificationCode);
//     if (!isValid) {
//       throw new ForbiddenException('Invalid verification code');
//     }

//     return true;
//   }
// }
