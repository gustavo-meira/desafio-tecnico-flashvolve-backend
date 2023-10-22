import { type HttpRequest, type Controller } from '@/presentation/protocols';
import { type Request, type Response } from 'express';

export const adaptExpressRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: {
        ...(req.body || {}),
        ...(req.params || {}),
      },
    };

    const { statusCode, body } = await controller.handle(httpRequest);

    res.status(statusCode).json(body);
  };
};
