import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rTracer from 'cls-rtracer';
import "express-async-errors";
import { Application, Response, Request, NextFunction, json, urlencoded } from 'express';
import * as HTTP_STATUS from 'http-status';
import LoggerFactory from "../utils/logger/factory";
import AppError from '../error/AppError';
import requestLogger from '../api/middleware/logger';
import routes from '../api/routes';


export default async ({ app }: { app: Application }) => {
  const logger = LoggerFactory.getLogger();
  
  app.enable('trust proxy');

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(urlencoded({ extended: false }));
  app.use(requestLogger());

  app.use(rTracer.expressMiddleware());
  app.use("/api", routes);

  app.use((req, res, next) => {
    const error = new AppError(HTTP_STATUS.NOT_FOUND, "RESOURES_NOT_FOUND");
    next(error)
  });

  app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn(`${err.name}, ${err.message}`);

      return res.status(err.statusCode).json({
        error: err.name,
        title: err.title,
        body: err.body,
      });
    }

    logger.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  });

  logger.info('express initialized');

  return app;
};