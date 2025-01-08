import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from 'src/interfaces/AuthRequest';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    req.lang = req.headers['accept-language'] || 'ar';  // Attach lang to the request
    next();
  }
}
