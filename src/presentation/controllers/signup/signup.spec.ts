import {
  type AddAccount,
  type AddAccountModel,
  type HttpRequest,
  type Validation,
  type InputValidation,
} from './signupProtocols';
import { SignUpController } from './signup';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { type AccountModel } from '@/domain/models/account';
import Chance from 'chance';
import { badRequest } from '@/presentation/helpers/httpHelpers';

const chance = new Chance();

const validAccount: AddAccountModel = {
  name: chance.name(),
  email: chance.email(),
  password: chance.word(),
};

const validAccountResponse: AccountModel = {
  id: chance.guid(),
  ...validAccount,
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return validAccountResponse;
    }
  }

  return new AddAccountStub();
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
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    ...validAccount,
    passwordConfirmation: validAccount.password,
  },
});

describe('SignUp Controller', () => {
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      throw new Error();
    });
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith(validAccount);
  });

  it('Should return 201 if valid data is provided and not return the password and id', async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual({
      name: validAccountResponse.name,
      email: validAccountResponse.email,
    });
  });

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const missingParamError = new MissingParamError(chance.word());
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(missingParamError);
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(missingParamError));
  });
});
