import { type Middleware } from '@/presentation/protocols/middleware';
import { type NextFunction, type Request, type Response } from 'express';

export const adaptExpressAuthMiddleware = (middleware: Middleware<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest = {
      accessToken: req.headers?.authorization?.split(' ')[1],
    };

    const { statusCode, body } = await middleware.handle(httpRequest);

    if (statusCode !== 200) {
      return res.status(statusCode).json(body);
    }

    Object.assign(req.body, body);

    next();
  };
};
