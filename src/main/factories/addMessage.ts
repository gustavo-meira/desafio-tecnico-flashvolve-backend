import { AddMessageController } from '@/presentation/controllers/addMessage/addMessage';
import { makeAddMessageValidations } from './addMessageValidations';
import { DbAddMessage } from '@/data/usecases/addMessage/dbAddMessage';
import { MessagePrismaRepo } from '@/infra/db/prisma/messageRepo/messageRepo';
import { ChatPrismaRepo } from '@/infra/db/prisma/chatRepo/chatRepo';

export const makeAddMessageController = (): AddMessageController => {
  const addChatRepository = new ChatPrismaRepo();
  const addMessageRepository = new MessagePrismaRepo();

  const dbAddMessage = new DbAddMessage(addMessageRepository, addChatRepository);

  const addMessageValidations = makeAddMessageValidations();

  const addMessageController = new AddMessageController(addMessageValidations, dbAddMessage);

  return addMessageController;
};
