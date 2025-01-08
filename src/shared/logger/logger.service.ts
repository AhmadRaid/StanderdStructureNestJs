import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.colorize(),
      format.printf(({ level, message, timestamp, context }) => {
        return `${timestamp} [${level}]${context ? ' [' + context + ']' : ''}: ${message}`;
      }),
    ),
    transports: [new transports.Console()],
  });

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(`${message} - ${trace}`, { context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
