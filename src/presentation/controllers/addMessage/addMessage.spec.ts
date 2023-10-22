import { badRequest, serverError } from '@/presentation/helpers/httpHelpers';
import { type HttpRequest, type InputValidation, type Validation } from '../signup/signupProtocols';
import { AddMessageController } from './addMessage';
import Chance from 'chance';
import { type AddMessageModel, type AddMessage } from '@/domain/useCases/addMessage';
import { type MessageModel } from '@/domain/models/message';

const chance = new Chance();

const httpRequest: HttpRequest = {
  body: {
    chatId: chance.integer(),
    text: chance.sentence(),
    senderName: chance.name(),
  },
};

const messageToResponse: MessageModel = {
  ...httpRequest.body,
  id: chance.integer({ min: 1000, max: 9999 }),
  createdAt: chance.date(),
  updatedAt: chance.date(),
};

const makeAddMessage = (): AddMessage => {
  class AddMessageStub implements AddMessage {
    async add (messageData: AddMessageModel): Promise<MessageModel> {
      return await Promise.resolve(messageToResponse);
    }
  }

  return new AddMessageStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: InputValidation): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: AddMessageController;
  validationStub: Validation;
  addMessageStub: AddMessage;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const addMessageStub = makeAddMessage();
  const sut = new AddMessageController(validationStub, addMessageStub);

  return {
    sut,
    validationStub,
    addMessageStub,
  };
};

describe('AddMessage Controller', () => {
  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return a badRequest on Validation fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('Should call AddMessage with correct values', async () => {
    const { sut, addMessageStub } = makeSut();
    const addSpy = jest.spyOn(addMessageStub, 'add');

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      ...httpRequest.body,
      fromBot: true,
    });
  });

  it('Should return serverError if AddMessage throws', async () => {
    const { sut, addMessageStub } = makeSut();
    jest.spyOn(addMessageStub, 'add').mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError());
  });
});
