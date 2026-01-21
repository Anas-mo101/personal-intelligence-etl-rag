import pino, { Logger } from "pino";
import config from "../../config/logger";
import AppError from "../../error/AppError";

export const LOG_LEVELS = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};


class LoggerFactory {
  static instance: LoggerFactory;
  logger!: Logger;

  constructor() {
    if (LoggerFactory.instance) {
      return LoggerFactory.instance;
    }
    LoggerFactory.instance = this;
  }

  initialize(options = {}) {
    const env = process.env.NODE_ENV || "development";
    const baseConfig = config.development;
    
    try {
      this.logger = pino({
        ...baseConfig,
        ...options
      }); // log file rotation here

      // Log initialization success
      this.logger.info({
        env,
        nodeVersion: process.version,
        pid: process.pid
      }, 'Logger initialized successfully');

    } catch (error) {
      console.error('Error initializing logger:', error);
      this.logger = pino({
        level: 'info',
        timestamp: true
      });
    }

    return this.logger;
  }

  getLogger() {
    if (!this.logger) {
      this.initialize();
    }
    return this.logger;
  }

  createChildLogger(bindings: any) {
    const logger = this.getLogger();

    if (!logger) {
      throw new AppError(400 ,"LOGGER_NOT_INIT");
    }

    return logger.child(bindings);
  }
}

export default new LoggerFactory();