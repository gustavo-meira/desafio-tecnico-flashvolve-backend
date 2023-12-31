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
      findMany: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return [{
          ...chatToResponse,
          id: BigInt(chatToResponse.id),
        }];
      },
    },
  },
}));

const makeSut = (): ChatPrismaRepo => {
  const sut = new ChatPrismaRepo();

  return sut;
};

describe('ChatPrisma Repo', () => {
  it('Should call prisma with correct values on add', async () => {
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

  it('Should throw if prisma throws on add', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.chat, 'upsert').mockRejectedValueOnce(new Error());

    const promise = sut.add(chatData);
    await expect(promise).rejects.toThrow();
  });

  it('Should return a chat on success on add', async () => {
    const sut = makeSut();

    const chat = await sut.add(chatData);
    expect(chat).toEqual(chatToResponse);
  });

  it('Should call prisma with correct values on loadAll', async () => {
    const sut = makeSut();
    const findManySpy = jest.spyOn(prismaDB.chat, 'findMany');

    await sut.loadAll();
    expect(findManySpy).toHaveBeenCalledWith({});
  });

  it('Should throw if prisma throws on loadAll', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.chat, 'findMany').mockRejectedValueOnce(new Error());

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow();
  });

  it('Should return a list of chats on success on loadAll', async () => {
    const sut = makeSut();

    const chats = await sut.loadAll();
    expect(chats).toEqual([chatToResponse]);
  });
});
