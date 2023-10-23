import { type Router } from 'express';
import { authMiddleware } from '../factories/authMiddleware';
import { adaptExpressAuthMiddleware } from '../adapters/expressMiddlewareAuthAdapter';
import { adaptExpressRoute } from '../adapters/expressRouteAdapter';
import { makeAddMessageController } from '../factories/addMessage';

export const messageRoutes = (router: Router): void => {
  router.post(
    '/message',
    adaptExpressAuthMiddleware(authMiddleware),
    adaptExpressRoute(makeAddMessageController()),
  );
};
