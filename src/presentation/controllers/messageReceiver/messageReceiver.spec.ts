import { MessageReceiverController } from './messageReceiver';
import { type HttpRequest } from '../signup/signupProtocols';
import { type AddMessageRepository } from '@/data/protocols/addMessageRepository';
import { type AddMessageModel } from '@/domain/useCases/addMessage';
import { type MessageModel } from '@/domain/models/message';
import Chance from 'chance';
import { ok, serverError } from '@/presentation/helpers/httpHelpers';

const chance = new Chance();

const messageToSend = {
  text: chance.string(),
  senderName: chance.name(),
  fromBot: chance.bool(),
  chatId: chance.integer({ min: 1000, max: 9999 }),
};

const messageToResponse: MessageModel = {
  ...messageToSend,
  id: chance.integer({ min: 1000, max: 9999 }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

const makeHttpRequest = (): HttpRequest => {
  const httpRequest = {
    body: {
      message: messageToSend,
    },
  };

  return httpRequest;
};

const makeAddMessageRepository = (): AddMessageRepository => {
  class AddMessageRepositoryStub implements AddMessageRepository {
    async add (messageData: AddMessageModel): Promise<MessageModel> {
      return await Promise.resolve(messageToResponse);
    }
  }

  return new AddMessageRepositoryStub();
};

interface SutTypes {
  sut: MessageReceiverController;
  addMessageRepositoryStub: AddMessageRepository;
};

const makeSut = (): SutTypes => {
  const addMessageRepositoryStub = makeAddMessageRepository();
  const sut = new MessageReceiverController(addMessageRepositoryStub);

  return {
    sut,
    addMessageRepositoryStub,
  };
};

describe('MessageReceiver Controller', () => {
  it('Should call AddMessageRepository with correct values', async () => {
    const { sut, addMessageRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addMessageRepositoryStub, 'add');
    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 500 if AddMessageRepository throws', async () => {
    const { sut, addMessageRepositoryStub } = makeSut();
    jest.spyOn(addMessageRepositoryStub, 'add').mockRejectedValueOnce(new Error());
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });

  it('Should return 200 if AddMessageRepository succeeds', async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(messageToResponse));
  });
});
