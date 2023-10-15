import {
  type EmailValidator,
  type AddAccount,
  type AddAccountModel,
  type HttpRequest,
  type Validation,
  type InputValidation,
} from './signupProtocols';
import { SignUpController } from './signup';
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors';
import { type AccountModel } from '@/domain/models/account';
import Chance from 'chance';
import { badRequest } from '@/presentation/helpers/httpHelpers';

const chance = new Chance();

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

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
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);
  return {
    sut,
    emailValidatorStub,
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
  it('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle({
      body: {
        ...httpRequest.body,
        password: 'password',
        passwordConfirmation: 'other_password',
      },
    });
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeHttpRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(validAccount.email);
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

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

  it('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(validAccountResponse);
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
