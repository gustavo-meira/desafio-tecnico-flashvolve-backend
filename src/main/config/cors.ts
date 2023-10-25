import cors from 'cors';
import { type Express } from 'express';

export const setupCors = (app: Express): void => {
  app.use(cors());
};
