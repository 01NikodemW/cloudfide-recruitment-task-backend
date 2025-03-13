import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDirectory = path.join(__dirname, '../../logs');

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({
            timestamp,
            level,
            message,
          }: {
            timestamp: string;
            level: string;
            message: string;
          }) => `${timestamp} [${level.toUpperCase()}]: ${message}`,
        ),
      ),
      transports: [
        new winston.transports.Console(),

        new winston.transports.DailyRotateFile({
          filename: `${logDirectory}/%DATE%/app.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          zippedArchive: true,
          level: 'info',
        }),
      ],
    });

    this.logger.info('LoggerService initialized');
  }

  log(message: string) {
    this.logger.info(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
