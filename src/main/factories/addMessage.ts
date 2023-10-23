import { AddMessageController } from '@/presentation/controllers/addMessage/addMessage';
import { makeAddMessageValidations } from './addMessageValidations';
import { DbAddMessage } from '@/data/usecases/addMessage/dbAddMessage';
import { MessagePrismaRepo } from '@/infra/db/prisma/messageRepo/messageRepo';
import { ChatPrismaRepo } from '@/infra/db/prisma/chatRepo/chatRepo';
import { makeAxiosAdapter } from './axiosAdapter';

export const makeAddMessageController = (): AddMessageController => {
  const addChatRepository = new ChatPrismaRepo();
  const addMessageRepository = new MessagePrismaRepo();
  const axiosAdapter = makeAxiosAdapter();

  const dbAddMessage = new DbAddMessage(addMessageRepository, addChatRepository, axiosAdapter);

  const addMessageValidations = makeAddMessageValidations();

  const addMessageController = new AddMessageController(addMessageValidations, dbAddMessage);

  return addMessageController;
};
