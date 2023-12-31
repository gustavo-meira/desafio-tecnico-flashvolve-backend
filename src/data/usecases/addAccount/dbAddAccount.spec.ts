import { type TokenGenerator } from '../authentication/dbAuthenticationProtocols';
import { DBAddAccount } from './dbAddAccount';
import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccountModel,
  type Hasher,
} from './dbAddAccountProtocols';
import Chance from 'chance';

const chance = new Chance();

const hashedPassword = chance.string();

const accountData: AddAccountModel = {
  name: chance.name(),
  email: chance.email(),
  password: chance.string(),
};

const accountModel: AccountModel = {
  id: chance.guid(),
  ...accountData,
};

const tokenToResponse = chance.string();

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate (userId: string): string {
      return tokenToResponse;
    }
  }

  return new TokenGeneratorStub();
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return hashedPassword;
    }
  }

  return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return accountModel;
    }
  }

  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DBAddAccount;
  hasherStub: Hasher;
  addAccountRepositoryStub: AddAccountRepository;
  tokenGeneratorStub: TokenGenerator;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub, tokenGeneratorStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    tokenGeneratorStub,
  };
};

describe('DBAddAccount UseCase', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hasherSpy = jest.spyOn(hasherStub, 'hash');

    await sut.add(accountData);
    expect(hasherSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));

      throw new Error();
    });

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      ...accountData,
      password: hashedPassword,
    });
  });

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));

      throw new Error();
    });

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.add(accountData);
    expect(generateSpy).toHaveBeenCalledWith(accountModel.id);
  });

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it('Should return an accessToken on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.add(accountData);
    expect(accessToken).toBe(tokenToResponse);
  });
});
