import express from 'express';
import { setupMiddlewares } from './middlewares';
import { setupRoutes } from './routes';
import { config } from 'dotenv';

const app = express();

config();
setupMiddlewares(app);
setupRoutes(app);

export { app };
