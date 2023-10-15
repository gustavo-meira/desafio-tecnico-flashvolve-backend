import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { badRequest, serverError } from '@/presentation/helpers/httpHelpers';
import { type EmailValidator } from '@/presentation/protocols/emailValidator';
import { SignInController } from './sigin';
import Chance from 'chance';
import { type Authentication } from '@/domain/useCases/authentication';
import { type AuthenticationModel } from '@/domain/models/authentication';

const chance = new Chance();

const signInAccount = {
  email: chance.email(),
  password: chance.string(),
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return 'any_token';
    }
  }

  return new AuthenticationStub();
};

interface SutTypes {
  sut: SignInController;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();
  const sut = new SignInController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('SignIn Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        password: signInAccount.password,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      body: {
        email: signInAccount.email,
      },
    });
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle({ body: signInAccount });
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(signInAccount.email);
  });

  it('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(serverError());
  });

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle({ body: signInAccount });
    expect(authSpy).toHaveBeenCalledWith(signInAccount);
  });
});
