import { type Express } from 'express';
import { bodyParser, contentType } from '../middlewares';

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
};
