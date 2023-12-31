import { type AddMessageModel } from '@/domain/useCases/addMessage';
import { MessagePrismaRepo } from './messageRepo';
import { type MessageModel } from '@/domain/models/message';
import { prismaDB } from '../lib/db';
import Chance from 'chance';

const chance = new Chance();

const messageData: AddMessageModel = {
  text: chance.string(),
  senderName: chance.name(),
  fromBot: chance.bool(),
  chatId: chance.integer({ min: 1000, max: 9999 }),
};

const messageToResponse: MessageModel = {
  ...messageData,
  id: chance.integer({ min: 1000, max: 9999 }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

jest.mock('../lib/db', () => ({
  prismaDB: {
    message: {
      create: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return {
          ...messageToResponse,
          chatId: BigInt(messageToResponse.chatId),
          id: BigInt(messageToResponse.id),
        };
      },
      findMany: async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return [
          {
            ...messageToResponse,
            chatId: BigInt(messageToResponse.chatId),
            id: BigInt(messageToResponse.id),
          },
        ];
      },
    },
  },
}));

const makeSut = (): MessagePrismaRepo => {
  const sut = new MessagePrismaRepo();

  return sut;
};

describe('MessagePrisma Repo', () => {
  it('Should call prisma with correct values on create', async () => {
    const sut = makeSut();
    const createSpy = jest.spyOn(prismaDB.message, 'create');

    await sut.add(messageData);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        senderName: messageData.senderName,
        text: messageData.text,
        fromBot: messageData.fromBot,
        chatId: BigInt(messageData.chatId),
      },
    });
  });

  it('Should throw if prisma throws on create', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.message, 'create').mockRejectedValueOnce(new Error());

    const promise = sut.add(messageData);
    await expect(promise).rejects.toThrow();
  });

  it('Should return the created message on success on create', async () => {
    const sut = makeSut();
    const message = await sut.add(messageData);

    expect(message).toEqual(messageToResponse);
  });

  it('Should call prisma with correct values on loadAll', async () => {
    const sut = makeSut();
    const findManySpy = jest.spyOn(prismaDB.message, 'findMany');

    await sut.loadAll(messageData.chatId);
    expect(findManySpy).toHaveBeenCalledWith({
      where: {
        chatId: BigInt(messageData.chatId),
      },
    });
  });

  it('Should throw if prisma throws on loadAll', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.message, 'findMany').mockRejectedValueOnce(new Error());

    const promise = sut.loadAll(messageData.chatId);
    await expect(promise).rejects.toThrow();
  });

  it('Should return a list of messages on success on loadAll', async () => {
    const sut = makeSut();
    const messages = await sut.loadAll(messageData.chatId);

    expect(messages).toEqual([messageToResponse]);
  });
});
