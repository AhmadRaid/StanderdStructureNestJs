import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let { offset, limit } = request.query;
 
    // Set default values if not provided
    offset = offset !== undefined ? parseInt(offset, 10) : 0;
    limit = limit !== undefined ? parseInt(limit, 10) : 10;

    if (isNaN(offset) || offset < 0) {
      throw new BadRequestException('Offset must be a positive integer or 0');
    }

    if (isNaN(limit) || limit < 0 || limit > 100) {
      throw new BadRequestException(
        'Limit must be an integer between 0 and 100',
      );
    }

    // Attach the validated and/or default values back to the query object
    request.query.offset = offset;
    request.query.limit = limit;

    return next.handle();
  }
}
