import { type AddMessageModel } from '@/domain/useCases/addMessage';
import { type Controller, type HttpRequest } from '@/presentation/protocols';
import { type Request, type Response } from 'express';

export const adaptTelegramMessage = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body?.message?.text) {
      res.status(400).json({ message: 'Bad Request' });
      return;
    }

    const httpRequestBody: AddMessageModel = {
      text: req.body.message.text,
      chatId: req.body.message.chat.id,
      senderName: req.body.message.from.first_name + ' ' + req.body.message.from.last_name,
      fromBot: false,
    };

    const httpRequest: HttpRequest = {
      body: httpRequestBody,
    };

    const { statusCode, body } = await controller.handle(httpRequest);

    res.status(statusCode).json(body);
  };
};
