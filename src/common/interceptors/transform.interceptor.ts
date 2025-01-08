import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError,  switchMap, tap } from 'rxjs/operators';
import { LoggerService } from 'src/shared/logger/logger.service';
import { ResponseModel } from '../classes/response.model';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TransformAPIInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    // private readonly i18n: I18nService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url, body, query, params } = req;
    const now = Date.now();

  
    if (process.env.NODE_ENV == 'development')
      this.logger.log(
        `Request: ${method} ${url} | Params: ${JSON.stringify(
          params,
        )} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
        'HTTP Request',
      );

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - now;

        if (!res.statusCode || res.statusCode === 201) {
          res.status(200);
        }

        const statusCode = res.statusCode;

        if (process.env.NODE_ENV == 'development')
          this.logger.log(
            `Response: ${method} ${url} | Status: ${statusCode} | Execution Time: ${executionTime}ms`,
            'HTTP Response',
          );
      }),

      switchMap(async (data) => {
        const statusCode = res.statusCode;
        // Check if the data contains a custom message
        const customMessage = data?.message || 'Success';

        // Remove the message from the data itself, if exists
        if (data?.message) {
          delete data.message;
        }
       
        return ResponseModel.success(
          statusCode,
          data,
          customMessage,
          'success',
        );
      }),

      catchError((err) => {
        console.log(err);
        this.logger.error(
          ` ${req.method} ${req.url} ${JSON.stringify(err.message)}`,
          TransformAPIInterceptor.name,
        );

        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}