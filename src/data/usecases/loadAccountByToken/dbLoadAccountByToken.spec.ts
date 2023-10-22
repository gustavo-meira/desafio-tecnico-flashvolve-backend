import { type Decrypter } from '@/data/protocols/decrypter';
import { DbLoadAccountByToken } from './dbLoadAccountByToken';
import Chance from 'chance';
import { type LoadAccountByIdRepository } from '@/data/protocols/loadAccountByIdRepository';
import { type AccountModel } from '../addAccount/dbAddAccountProtocols';

const chance = new Chance();

const id = chance.guid();
const accessToken = chance.string({ length: 32 });

const accountToResponse: AccountModel = {
  id,
  name: chance.name(),
  email: chance.email(),
  password: chance.string(),
};

const makeLoadAccountByIdRepository = (): LoadAccountByIdRepository => {
  class LoadAccountByIdRepositoryStub implements LoadAccountByIdRepository {
    async loadById (id: string): Promise<AccountModel> {
      return accountToResponse;
    }
  }

  return new LoadAccountByIdRepositoryStub();
};

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return id;
    }
  }

  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
  loadAccountByIdRepositoryStub: LoadAccountByIdRepository;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const loadAccountByIdRepositoryStub = makeLoadAccountByIdRepository();
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByIdRepositoryStub);

  return {
    sut,
    decrypterStub,
    loadAccountByIdRepositoryStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut();
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load(accessToken);
    expect(decrypterSpy).toHaveBeenCalledWith(accessToken);
  });

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null);

    const account = await sut.load(accessToken);
    expect(account).toBeNull();
  });

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error());

    const promise = sut.load(accessToken);
    await expect(promise).rejects.toThrow();
  });

  it('Should call LoadAccountByIdRepository with correct value', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    const loadByIdSpy = jest.spyOn(loadAccountByIdRepositoryStub, 'loadById');

    await sut.load(accessToken);
    expect(loadByIdSpy).toHaveBeenCalledWith(accountToResponse.id);
  });

  it('Should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockResolvedValueOnce(null);

    const account = await sut.load(accessToken);
    expect(account).toBeNull();
  });

  it('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error());

    const promise = sut.load(accessToken);
    await expect(promise).rejects.toThrow();
  });

  it('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.load(accessToken);
    expect(account).toEqual(accountToResponse);
  });
});
