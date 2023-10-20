import { type Router } from 'express';
import { adaptTelegramMessage } from '../adapters/telegramMessageAdapter';
import { makeMessageReceiverController } from '../factories/messageReceiver';

export const telegramRoutes = (router: Router): void => {
  router.post('/telegram/webhook', adaptTelegramMessage(makeMessageReceiverController()));
};
