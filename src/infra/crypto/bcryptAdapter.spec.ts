import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return 'hashed_value';
  },
}));

const makeSut = (salt = 12): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);

  return sut;
};

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = makeSut(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a hash on success', async () => {
    const sut = makeSut();

    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });

  it('Should throw if bcrypt throw', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
