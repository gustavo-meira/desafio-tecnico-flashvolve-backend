import { type Express } from 'express';
import { bodyParser } from '../middlewares/bodyParser';
import { cors } from '../middlewares/cors';
import { contentType } from '../middlewares/contentType';

export const setupMiddlewares = (app: Express): void => {
  app.use(bodyParser);
  app.use(cors);
  app.use(contentType);
};
