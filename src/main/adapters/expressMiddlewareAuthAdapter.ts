import { type Middleware } from '@/presentation/protocols/middleware';
import { type NextFunction, type Request, type Response } from 'express';

export const adaptExpressAuthMiddleware = (middleware: Middleware<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, body } = await middleware.handle(req.body);

    if (statusCode !== 200) {
      return res.status(statusCode).json(body);
    }

    Object.assign(req, body);

    next();
  };
};
