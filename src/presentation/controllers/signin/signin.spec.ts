import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/httpHelpers';
import { SignInController } from './sigin';
import Chance from 'chance';
import { type Authentication } from '@/domain/useCases/authentication';
import { type AuthenticationModel } from '@/domain/models/authentication';

const chance = new Chance();

const signInAccount = {
  email: chance.email(),
  password: chance.string(),
};

const accessToken = chance.string();

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return accessToken;
    }
  }

  return new AuthenticationStub();
};

interface SutTypes {
  sut: SignInController;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const sut = new SignInController(authenticationStub);

  return {
    sut,
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

  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle({ body: signInAccount });
    expect(authSpy).toHaveBeenCalledWith(signInAccount);
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(serverError());
  });

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(ok({ accessToken }));
  });
});
