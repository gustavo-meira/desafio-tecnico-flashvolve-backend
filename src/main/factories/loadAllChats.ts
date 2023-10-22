import { DbLoadAllChats } from '@/data/usecases/loadAllChats/dbLoadAllChats';
import { ChatPrismaRepo } from '@/infra/db/prisma/chatRepo/chatRepo';
import { LoadAllChatsController } from '@/presentation/controllers/loadAllChats/loadAllChats';

export const makeLoadAllChatsController = (): LoadAllChatsController => {
  const chatRepo = new ChatPrismaRepo();

  const dbLoadAllChats = new DbLoadAllChats(chatRepo);

  const loadAllChatsController = new LoadAllChatsController(dbLoadAllChats);

  return loadAllChatsController;
};
