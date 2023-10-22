import { DbLoadAllMessages } from '@/data/usecases/loadAllMessages/dbLoadAllMessages';
import { MessagePrismaRepo } from '@/infra/db/prisma/messageRepo/messageRepo';
import { LoadAllMessagesController } from '@/presentation/controllers/loadAllMessages/loadAllMessages';
import { makeLoadAllMessagesValidations } from './loadAllMessagesValidations';

export const makeLoadAllMessagesController = (): LoadAllMessagesController => {
  const messageRepo = new MessagePrismaRepo();

  const dbLoadAllMessages = new DbLoadAllMessages(messageRepo);

  const loadAllMessagesValidations = makeLoadAllMessagesValidations();
  const loadAllMessagesController = new LoadAllMessagesController(loadAllMessagesValidations, dbLoadAllMessages);

  return loadAllMessagesController;
};
