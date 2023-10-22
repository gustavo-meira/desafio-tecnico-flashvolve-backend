import { MissingParamError } from '@/presentation/errors';
import { type HttpRequest, type InputValidation, type Validation } from '../signup/signupProtocols';
import { LoadAllMessagesController } from './loadAllMessages';
import Chance from 'chance';
import { badRequest } from '@/presentation/helpers/httpHelpers';

const chance = new Chance();

const httpRequest: HttpRequest = {
  body: {
    chatId: chance.string(),
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
  sut: LoadAllMessagesController;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new LoadAllMessagesController(validationStub);

  return {
    sut,
    validationStub,
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
});
