import { AuthMiddleware } from './auth';
import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type AccountModel } from '../controllers/signup/signupProtocols';
import Chance from 'chance';

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
  it('Should call LoadAccountByToken with correct value', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load');

    await sut.handle({ accessToken });
    expect(loadAccountByTokenStub.load).toHaveBeenCalledWith(accessToken);
  });
});
