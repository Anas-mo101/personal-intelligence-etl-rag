import { Logger } from "pino";
import LoggerFactory from "../utils/logger/factory";

interface ErrorLog {
  name?: string;
  message?: string;
  stack?: string;
  code?: string | number;
  response?: {
    status?: number;
    data?: any;
  };
  [key: string]: any; // To allow context properties
}

class ErrorLogger {
  private static getLogger(): Logger {
    return LoggerFactory.getLogger();
  }

  static logError(error: any, context: Record<string, any> = {}): void {
    const logger: Logger = ErrorLogger.getLogger();

    const errorLog: ErrorLog = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      ...context,
    };

    if (error.response) {
      errorLog.response = {
        status: error.response.status,
        data: error.response.data,
      };
    }

    logger.error(errorLog, 'Internal server error');
  }

  static logWarning(warning: string | object, context: Record<string, any> = {}): void {
    const logger: Logger = ErrorLogger.getLogger();

    logger.warn(
      {
        warning,
        ...context,
      },
      'Application warning occurred'
    );
  }
}

export default ErrorLogger;