import { badRequest } from '@/presentation/helpers/httpHelpers';
import { type HttpRequest, type InputValidation, type Validation } from '../signup/signupProtocols';
import { AddMessageController } from './addMessage';
import Chance from 'chance';

const chance = new Chance();

const httpRequest: HttpRequest = {
  body: {
    chatId: chance.integer(),
    text: chance.sentence(),
    senderName: chance.name(),
  },
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
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddMessageController(validationStub);

  return {
    sut,
    validationStub,
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
});
