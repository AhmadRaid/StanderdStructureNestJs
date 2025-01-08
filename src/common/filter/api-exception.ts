import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../../shared/logger/logger.service';
import { ResponseModel } from '../classes/response.model';
import { I18nService } from 'nestjs-i18n';
import { ThrottlerException } from '@nestjs/throttler';

/**
 * Exception handler, provides unified exception response data
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private i18n: I18nService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const safeRequest = {
      url: request.url,
      method: request.method,
      params: request.params,
      body: request.body,
      query: request.query,
      headers: request.headers,
    };

    const lang = request.headers['accept-language']?.split(',')[0] || 'ar';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.header('Content-Type', 'application/json; charset=utf-8');

    let message =
      exception['message'] ||
      exception['response']['message'] ||
      exception['response']['error'] ||
      exception['error'] ||
      'BAD_REQUEST';


    if (exception instanceof ThrottlerException) {
      message = await this.i18n.t('common.TOO_MANY_REQUESTS', { lang });
    } else if (this.i18n) {
      message = (await this.i18n.t(`common.${message}`, { lang })) as string;
    }

    let result = new ResponseModel(status, null, message, 'failed');

    if (exception['response']?.['message'] === 'Validation failed') {
      const validationErrors = exception['response']['errors'];
      if (validationErrors && Array.isArray(validationErrors)) {
        const firstError = validationErrors[0];
        const firstConstraintKey = Object.keys(firstError.constraints)[0];
        const firstConstraintMessage =
          firstError.constraints[firstConstraintKey];

        message = firstConstraintMessage;

        result = new ResponseModel(status, null, message, 'failed');
      }
    }

    if (status >= 500) {
      this.logger.error(
        `request: ${JSON.stringify(safeRequest)} response: ${JSON.stringify(
          exception,
        )} message: ${message}`,
        ApiExceptionFilter.name,
      );

      message = await this.i18n.t('INTERNAL_SERVER_ERROR', { lang });
    } else if (status >= 400) {
      this.logger.warn(
        `Request: ${JSON.stringify(safeRequest)} Response: ${JSON.stringify(
          exception,
        )} Message: ${message}`,
      );

      if (exception['response']?.['message'] === 'Bad Request') {
        message = await this.i18n.t('BAD_REQUEST', { lang });
      } else if (
        exception['response']?.['message'] &&
        typeof exception['response']['message'] === 'string' &&
        exception['response']['message'].includes('Unauthorized')
      ) {
        message = await this.i18n.t('UNAUTHORIZED', { lang });
      } else if (exception['response']?.['message'] === 'Not Found') {
        message = await this.i18n.t('NOT_FOUND', { lang });
      } else if (exception['response']?.['message'] === 'Forbidden') {
        message = await this.i18n.t('FORBIDDEN', { lang });
      }
    }

    if (status >= 400) {
      // Send error response
      response.status(status).send(result);
    } else {
      // Send successful response (without error)
      const successfulResponse = new ResponseModel(
        status,
        {},
        message,
        'success',
      );
      response.status(status).send(successfulResponse);
    }
  }
}
