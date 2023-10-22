import { type LoadAllChatsRepository } from '@/data/protocols/loadAllChatsRepository';
import { DbLoadAllChats } from './dbLoadAllChats';
import Chance from 'chance';
import { type ChatModel } from '@/domain/models/chat';

const chance = new Chance();

const makeFakeChat = (): ChatModel => ({
  id: chance.integer({ min: 1 }),
  lastMessage: chance.sentence(),
  name: chance.name(),
  createdAt: chance.date(),
  updatedAt: chance.date(),
});

const chatsToResponse = [
  makeFakeChat(),
  makeFakeChat(),
  makeFakeChat(),
];

const makeLoadAllChatsRepository = (): LoadAllChatsRepository => {
  class LoadAllChatsRepositoryStub implements LoadAllChatsRepository {
    async loadAll (): Promise<ChatModel[]> {
      return chatsToResponse;
    }
  }

  return new LoadAllChatsRepositoryStub();
};

interface SutTypes {
  sut: DbLoadAllChats;
  loadAllChatsRepositoryStub: LoadAllChatsRepository;
}

const makeSut = (): SutTypes => {
  const loadAllChatsRepositoryStub = makeLoadAllChatsRepository();
  const sut = new DbLoadAllChats(loadAllChatsRepositoryStub);

  return {
    sut,
    loadAllChatsRepositoryStub,
  };
};

describe('DbLoadAllChats UseCase', () => {
  it('Should call LoadAllChatsRepository', async () => {
    const { sut, loadAllChatsRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadAllChatsRepositoryStub, 'loadAll');

    await sut.loadAll();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('Should throw if LoadAllChatsRepository throws', async () => {
    const { sut, loadAllChatsRepositoryStub } = makeSut();
    jest.spyOn(loadAllChatsRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error());

    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow();
  });
});
