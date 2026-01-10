import { Request, Response, NextFunction } from 'express';
import LoggerFactory from "../../utils/logger/factory";

interface LogData {
  method: string;
  url: string;
  statusCode: number;
  responseTime: string;
  userAgent?: string;
  ip?: string;
  correlationId?: string;
}

const requestLogger = () => {
  const logger = LoggerFactory.getLogger();

  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = process.hrtime();
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const responseTime = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

      const logData: LogData = {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('user-agent'),
        ip: req.ip,
        correlationId: req.get('x-correlation-id'),
      };

      if (res.statusCode < 400) {
        logger.info(logData);
      }
    });

    next();
  };
}

export default requestLogger;