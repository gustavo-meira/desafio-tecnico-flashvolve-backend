import { type Express, Router } from 'express';
import * as routes from '../routes';

export const setupRoutes = (app: Express): void => {
  const router = Router();

  Object.values(routes).forEach((route) => {
    route(router);
  });

  app.use('/api', router);
};
