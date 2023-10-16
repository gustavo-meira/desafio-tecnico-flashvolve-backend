import { DbAuthentication } from './dbAuthentication';
import {
  type AccountModel,
  type LoadAccountByEmailRepository,
  type HashComparer,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
} from './dbAuthenticationProtocols';
import Chance from 'chance';

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

const token = chance.string();

const makeLoadAccountByEmailRepo = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate (id: string): string {
      return token;
    }
  }

  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepo = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      await Promise.resolve();
    }
  }

  return new UpdateAccessTokenRepoStub();
};

interface SutType {
  sut: DbAuthentication;
  loadAccountByEmailRepo: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepoStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutType => {
  const loadAccountByEmailRepo = makeLoadAccountByEmailRepo();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepoStub = makeUpdateAccessTokenRepo();
  const sut = new DbAuthentication(
    loadAccountByEmailRepo,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepoStub,
  );

  return {
    sut,
    loadAccountByEmailRepo,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepoStub,
  };
};

describe('DBAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepo, 'loadByEmail');

    await sut.auth(accountToFind);
    expect(loadSpy).toHaveBeenCalledWith(accountToFind.email);
  });

  it('Should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    jest.spyOn(loadAccountByEmailRepo, 'loadByEmail').mockRejectedValueOnce(new Error());

    const promise = sut.auth(accountToFind);
    await expect(promise).rejects.toThrow();
  });

  it('Should return null if LoadAccountByEmailRepo returns null', async () => {
    const { sut, loadAccountByEmailRepo } = makeSut();
    jest.spyOn(loadAccountByEmailRepo, 'loadByEmail').mockResolvedValueOnce(null);

    const accessToken = await sut.auth(accountToFind);
    expect(accessToken).toBeNull();
  });

  it('Should call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(accountToFind);
    expect(compareSpy).toHaveBeenCalledWith(accountToFind.password, accountToReturn.password);
  });

  it('Should throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error());

    const promise = sut.auth(accountToFind);
    await expect(promise).rejects.toThrow();
  });

  it('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false);

    const accessToken = await sut.auth(accountToFind);
    expect(accessToken).toBeNull();
  });

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(accountToFind);
    expect(generateSpy).toHaveBeenCalledWith(accountToReturn.id);
  });

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.auth(accountToFind);
    await expect(promise).rejects.toThrow();
  });

  it('Should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(accountToFind);
    expect(accessToken).toBe(token);
  });

  it('Should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken');

    await sut.auth(accountToFind);
    expect(updateSpy).toHaveBeenCalledWith(accountToReturn.id, token);
  });

  it('Should throw if UpdateAccessTokenRepo throws', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut();
    jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken').mockRejectedValueOnce(new Error());

    const promise = sut.auth(accountToFind);
    await expect(promise).rejects.toThrow();
  });
});
