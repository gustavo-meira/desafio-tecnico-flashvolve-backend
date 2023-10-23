import { DbAddMessage } from '@/data/usecases/addMessage/dbAddMessage';
import { ChatPrismaRepo } from '@/infra/db/prisma/chatRepo/chatRepo';
import { MessagePrismaRepo } from '@/infra/db/prisma/messageRepo/messageRepo';
import { MessageReceiverController } from '@/presentation/controllers/messageReceiver/messageReceiver';
import { type Controller } from '@/presentation/protocols';
import { makeAxiosAdapter } from './axiosAdapter';

export const makeMessageReceiverController = (): Controller => {
  const addChatRepository = new ChatPrismaRepo();
  const addMessageRepository = new MessagePrismaRepo();
  const axiosAdapter = makeAxiosAdapter();

  const dbAddMessage = new DbAddMessage(addMessageRepository, addChatRepository, axiosAdapter);

  const messageReceiver = new MessageReceiverController(dbAddMessage);

  return messageReceiver;
};
