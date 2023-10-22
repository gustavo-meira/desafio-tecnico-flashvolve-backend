import { DbLoadAllMessages } from './dbLoadAllMessages';
import { type LoadAllMessagesRepository } from '@/data/protocols/loadAllMessagesRepository';
import { type MessageModel } from '@/domain/models/message';
import Chance from 'chance';

const chance = new Chance();

const chatId = chance.integer();

const makeMessage = (): MessageModel => ({
  id: chance.integer(),
  text: chance.string(),
  chatId: chance.integer(),
  senderName: chance.name(),
  fromBot: chance.bool(),
  createdAt: chance.date(),
  updatedAt: chance.date(),
});

const messageToSend = [
  makeMessage(),
  makeMessage(),
  makeMessage(),
];

const makeLoadAllMessagesRepository = (): LoadAllMessagesRepository => {
  class LoadAllChatsRepositoryStub implements LoadAllMessagesRepository {
    async loadAll (): Promise<MessageModel[]> {
      return messageToSend;
    }
  }

  return new LoadAllChatsRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAllMessages;
  loadAllMessagesRepositoryStub: LoadAllMessagesRepository;
}

const makeSut = (): SutTypes => {
  const loadAllMessagesRepositoryStub = makeLoadAllMessagesRepository();
  const sut = new DbLoadAllMessages(loadAllMessagesRepositoryStub);

  return {
    sut,
    loadAllMessagesRepositoryStub,
  };
};

describe('DbLoadAllMessages UseCase', () => {
  it('Should call LoadAllMessagesRepository with correct value', async () => {
    const { sut, loadAllMessagesRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadAllMessagesRepositoryStub, 'loadAll');

    await sut.load(chatId);
    expect(loadAllSpy).toHaveBeenCalledWith(chatId);
  });

  it('Should throw if LoadAllMessagesRepository throws', async () => {
    const { sut, loadAllMessagesRepositoryStub } = makeSut();
    jest.spyOn(loadAllMessagesRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error());

    const promise = sut.load(chatId);
    await expect(promise).rejects.toThrow();
  });

  it('Should return a list of messages on success', async () => {
    const { sut } = makeSut();

    const messages = await sut.load(chatId);
    expect(messages).toEqual(messageToSend);
  });
});
