import { type AccountModel } from '@/domain/models/account';
import { DbAuthentication } from './dbAuthentication';
import Chance from 'chance';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';
import { type HashComparer } from '@/data/protocols/hashCompare';

const chance = new Chance();

const accountToFind = {
  email: chance.email(),
  password: chance.string(),
};

const accountToReturn: AccountModel = {
  id: chance.guid(),
  name: chance.name(),
  password: chance.string(),
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

const makeHashComparer = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }

  return new HashCompareStub();
};

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepo: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
};

const makeSut = (): SutType => {
  const loadAccountByEmailRepo = makeLoadAccountByEmailRepo();
  const hashComparerStub = makeHashComparer();
  const sut = new DbAuthentication(loadAccountByEmailRepo, hashComparerStub);

  return {
    sut,
    loadAccountByEmailRepo,
    hashComparerStub,
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

  it('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(accountToFind);
    expect(compareSpy).toHaveBeenCalledWith(accountToFind.password, accountToReturn.password);
  });
});
