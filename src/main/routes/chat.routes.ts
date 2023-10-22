import { type Router } from 'express';
import { authMiddleware } from '../factories/authMiddleware';
import { adaptExpressAuthMiddleware } from '../adapters/expressMiddlewareAuthAdapter';
import { adaptExpressRoute } from '../adapters/expressRouteAdapter';
import { makeLoadAllChatsController } from '../factories/loadAllChats';
import { makeLoadAllMessagesController } from '../factories/loadAllMessages';

export const chatRoutes = (router: Router): void => {
  router.get(
    '/chat',
    adaptExpressAuthMiddleware(authMiddleware),
    adaptExpressRoute(makeLoadAllChatsController()),
  );

  router.get(
    '/chat/:chatId/messages',
    adaptExpressAuthMiddleware(authMiddleware),
    adaptExpressRoute(makeLoadAllMessagesController()),
  );
};
