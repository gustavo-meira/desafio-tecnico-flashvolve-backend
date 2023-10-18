import { type ChatModel } from '@/domain/models/chat';
import { type AddChatModel } from '@/domain/useCases/addChat';
import Chance from 'chance';
import { prismaDB } from '../lib/db';
import { ChatPrismaRepo } from './chatRepo';

const chance = new Chance();

const chatData: AddChatModel = {
  id: chance.integer({ min: 1000, max: 9999 }),
  name: chance.name(),
  lastMessage: chance.string(),
};

const chatToResponse: ChatModel = {
  ...chatData,
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

jest.mock('../lib/db', () => ({
  prismaDB: {
    chat: {
      upsert: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return {
          ...chatToResponse,
          id: BigInt(chatToResponse.id),
        };
      },
    },
  },
}));

const makeSut = (): ChatPrismaRepo => {
  const sut = new ChatPrismaRepo();

  return sut;
};

describe('ChatPrisma Repo', () => {
  it('Should call prisma with correct values', async () => {
    const sut = makeSut();
    const createSpy = jest.spyOn(prismaDB.chat, 'upsert');

    await sut.add(chatData);
    expect(createSpy).toHaveBeenCalledWith({
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
  });
});
