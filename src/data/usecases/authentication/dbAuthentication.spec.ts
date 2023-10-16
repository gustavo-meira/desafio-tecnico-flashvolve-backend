import { type AccountModel } from '@/domain/models/account';
import { DbAuthentication } from './dbAuthentication';
import Chance from 'chance';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';

const chance = new Chance();

const accountToFind = {
  email: chance.email(),
  password: chance.string(),
};

const accountToReturn: AccountModel = {
  id: chance.guid(),
  name: chance.name(),
  ...accountToFind,
};

const makeLoadAccountByEmailRepo = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(accountToReturn); });
    }
  }

  return new LoadAccountByEmailRepoStub();
};

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepo: LoadAccountByEmailRepository;
};

const makeSut = (): SutType => {
  const loadAccountByEmailRepo = makeLoadAccountByEmailRepo();
  const sut = new DbAuthentication(loadAccountByEmailRepo);

  return {
    sut,
    loadAccountByEmailRepo,
  };
};

describe('DBAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepo, 'load');

    await sut.auth(accountToFind);
    expect(loadSpy).toHaveBeenCalledWith(accountToFind.email);
  });

  it('Should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    jest.spyOn(loadAccountByEmailRepo, 'load').mockRejectedValueOnce(new Error());

    const promise = sut.auth(accountToFind);
    await expect(promise).rejects.toThrow();
  });

  it('Should return null if LoadAccountByEmailRepo returns null', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    jest.spyOn(loadAccountByEmailRepo, 'load').mockResolvedValueOnce(null);

    const accessToken = await sut.auth(accountToFind);
    expect(accessToken).toBeNull();
  });
});
