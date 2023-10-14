import { DBAddAccount } from './dbAddAccount';
import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccountModel,
  type Encrypter,
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

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return hashedPassword;
    }
  }

  return new EncrypterStub();
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
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('DBAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

    await sut.add(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
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

  it('Should return an account on success', async () => {
    const { sut } = makeSut();

    const account = await sut.add(accountData);
    expect(account).toEqual(accountModel);
  });
});
