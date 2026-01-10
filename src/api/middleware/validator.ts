import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodObject } from 'zod';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

// Define a type for the properties we want to validate
export type ValidatedRequest<T> = Request & {
  body: T;
};

// Generic validation middleware
export const validate = (schema: ZodObject): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new AppError(httpStatus.BAD_REQUEST, "VALIDATION_ERROR");
      } else {
        // Handle other potential errors
        next(error);
      }
    }
  };
};
