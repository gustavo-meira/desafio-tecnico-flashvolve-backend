import Chance from 'chance';
import { LoadAllChatsController } from './loadAllChats';
import { type LoadAllChats } from '@/domain/useCases/loadAllChats';
import { type ChatModel } from '@/domain/models/chat';
import { type HttpRequest } from '../signup/signupProtocols';
import { ok, serverError } from '@/presentation/helpers/httpHelpers';

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

const httpRequest: HttpRequest = {
  body: {},
};

const makeLoadAllChats = (): LoadAllChats => {
  class LoadAllChatsStub implements LoadAllChats {
    async loadAll (): Promise<ChatModel[]> {
      return chatsToResponse;
    }
  }

  return new LoadAllChatsStub();
};

interface SutTypes {
  sut: LoadAllChatsController;
  loadAllChatsStub: LoadAllChats;
}

const makeSut = (): SutTypes => {
  const loadAllChatsStub = makeLoadAllChats();
  const sut = new LoadAllChatsController(loadAllChatsStub);

  return {
    sut,
    loadAllChatsStub,
  };
};

describe('LoadAllChats Controller', () => {
  it('Should call LoadAllChats', async () => {
    const { sut, loadAllChatsStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadAllChatsStub, 'loadAll');

    await sut.handle(httpRequest);

    expect(loadAllSpy).toHaveBeenCalled();
  });

  it('Should return 500 if LoadAllChats throws', async () => {
    const { sut, loadAllChatsStub } = makeSut();
    jest.spyOn(loadAllChatsStub, 'loadAll').mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  it('Should return all chats on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(chatsToResponse));
  });
});
