import { DBAddAccount } from './dbAddAccount';
import { type Encrypter } from './dbAddAccountProtocols';

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 1));

      return 'hashed_value';
    }
  }

  return new EncrypterStub();
};

interface SutTypes {
  sut: DBAddAccount;
  encrypterStub: Encrypter;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DBAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
  };
};

describe('DBAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    await sut.add(accountData);
    expect(encrypterSpy).toHaveBeenCalledWith(accountData.password);
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));

      throw new Error();
    });
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
