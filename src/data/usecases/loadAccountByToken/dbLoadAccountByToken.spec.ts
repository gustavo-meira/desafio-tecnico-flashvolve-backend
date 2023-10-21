import { type Decrypter } from '@/data/protocols/decrypter';
import { DbLoadAccountByToken } from './dbLoadAccountByToken';
import Chance from 'chance';

const chance = new Chance();

const decrypterReturn = chance.string();
const accessToken = chance.string({ length: 32 });

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return decrypterReturn;
    }
  }

  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new DbLoadAccountByToken(decrypterStub);

  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken UseCase', () => {
  it('Should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut();
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

    await sut.load(accessToken);
    expect(decrypterSpy).toHaveBeenCalledWith(accessToken);
  });
});
