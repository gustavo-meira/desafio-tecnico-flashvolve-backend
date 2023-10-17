import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/httpHelpers';
import { SignInController } from './sigin';
import Chance from 'chance';
import { type Authentication } from '@/domain/useCases/authentication';
import { type AuthenticationModel } from '@/domain/models/authentication';
import { type InputValidation, type Validation } from './siginProtocols';

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

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: InputValidation): Error | null {
      return null;
    }
  }

  return new ValidationStub();
};

interface SutTypes {
  sut: SignInController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new SignInController(authenticationStub, validationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('SignIn Controller', () => {
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

  it('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    await sut.handle({ body: signInAccount });
    expect(validateSpy).toHaveBeenCalledWith(signInAccount);
  });

  it('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    const missingParamError = new MissingParamError(chance.word());
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(missingParamError);

    const httpResponse = await sut.handle({ body: signInAccount });
    expect(httpResponse).toEqual(badRequest(missingParamError));
  });
});
