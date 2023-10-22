import express from 'express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { config } from 'dotenv';

const app = express();

config();

if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var');
}

setupMiddlewares(app);
setupRoutes(app);

export { app };
