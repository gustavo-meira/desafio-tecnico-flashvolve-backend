import { AuthMiddleware } from './auth';
import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type AccountModel } from '../controllers/signup/signupProtocols';
import Chance from 'chance';
import { forbidden, serverError } from '../helpers/httpHelpers';
import { AccessDeniedError } from '../errors';

const chance = new Chance();

const accountToSend: AccountModel = {
  id: chance.guid(),
  name: chance.name(),
  email: chance.email(),
  password: chance.string(),
};

const accessToken = chance.string({ length: 36 });

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel> {
      return await Promise.resolve(accountToSend);
    }
  }
  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  it('Should return 403 if no accessToken is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should call LoadAccountByToken with correct value', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle({ accessToken });
    expect(loadAccountByTokenStub.load).toHaveBeenCalledWith(accessToken);
  });

  it('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null);

    const httpResponse = await sut.handle({ accessToken });
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error());

    const httpResponse = await sut.handle({ accessToken });
    expect(httpResponse).toEqual(serverError());
  });
});
