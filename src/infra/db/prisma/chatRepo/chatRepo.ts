import { type AddChatRepository } from '@/data/protocols/addChatRepository';
import { type ChatModel } from '@/domain/models/chat';
import { type AddChatModel } from '@/domain/useCases/addChat';
import { prismaDB } from '../lib/db';
import { type LoadAllChatsRepository } from '@/data/protocols/loadAllChatsRepository';

export class ChatPrismaRepo implements AddChatRepository, LoadAllChatsRepository {
  async add (chatData: AddChatModel): Promise<ChatModel> {
    const chat = await prismaDB.chat.upsert({
      create: {
        id: BigInt(chatData.id),
        name: chatData.name,
        lastMessage: chatData.lastMessage,
      },
      update: {
        lastMessage: chatData.lastMessage,
      },
      where: {
        id: BigInt(chatData.id),
      },
    });

    return {
      ...chat,
      id: Number(chat.id),
    };
  }

  async loadAll (): Promise<ChatModel[]> {
    await prismaDB.chat.findMany({});

    return [];
  }
}
