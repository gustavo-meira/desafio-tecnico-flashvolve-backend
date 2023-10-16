import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';
import Chance from 'chance';

const chance = new Chance();

const hashedValue = chance.string();

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return hashedValue;
  },
  async compare (): Promise<boolean> {
    return await Promise.resolve(true);
  },
}));

const makeSut = (salt = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);

  return sut;
};

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct values', async () => {
    const salt = 12;
    const sut = makeSut(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const valueToHash = chance.string();

    await sut.hash(valueToHash);
    expect(hashSpy).toHaveBeenCalledWith(valueToHash, salt);
  });

  it('Should return a hash on hash success', async () => {
    const sut = makeSut();

    const hash = await sut.hash(chance.string());
    expect(hash).toBe(hashedValue);
  });

  it('Should throw if hash throw', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.hash(chance.string());
    await expect(promise).rejects.toThrow();
  });

  it('Should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    const valueToCompare = chance.string();
    const hash = chance.string();

    await sut.compare(valueToCompare, hash);
    expect(compareSpy).toHaveBeenCalledWith(valueToCompare, hash);
  });

  it('Should return true when compare succeeds', async () => {
    const sut = makeSut();

    const isEquals = await sut.compare(chance.string(), chance.string());
    expect(isEquals).toBe(true);
  });

  it('Should return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false));

    const isEquals = await sut.compare(chance.string(), chance.string());
    expect(isEquals).toBe(false);
  });

  it('Should throw if compare throw', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.compare(chance.string(), chance.string());
    await expect(promise).rejects.toThrow();
  });
});
