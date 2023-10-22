import { MissingParamError } from '@/presentation/errors';
import { type HttpRequest, type InputValidation, type Validation } from '../signup/signupProtocols';
import { LoadAllMessagesController } from './loadAllMessages';
import { type LoadMessages } from '@/domain/useCases/loadMessages';
import Chance from 'chance';
import { badRequest } from '@/presentation/helpers/httpHelpers';
import { type MessageModel } from '@/domain/models/message';

const chance = new Chance();

const httpRequest: HttpRequest = {
  body: {
    chatId: chance.string(),
  },
};

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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: InputValidation): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

const makeLoadMessages = (): LoadMessages => {
  class LoadMessagesStub implements LoadMessages {
    async load (chatId: number): Promise<MessageModel[]> {
      return messageToSend;
    }
  }

  return new LoadMessagesStub();
};

interface SutTypes {
  sut: LoadAllMessagesController;
  validationStub: Validation;
  loadMessagesStub: LoadMessages;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const loadMessagesStub = makeLoadMessages();
  const sut = new LoadAllMessagesController(validationStub, loadMessagesStub);

  return {
    sut,
    validationStub,
    loadMessagesStub,
  };
};

describe('LoadAllMessages Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return badRequest if Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('chatId'));

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('chatId')));
  });

  it('Should call LoadAllMessages with correct values', async () => {
    const { sut, loadMessagesStub } = makeSut();
    const loadSpy = jest.spyOn(loadMessagesStub, 'load');

    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.body.chatId);
  });
});
