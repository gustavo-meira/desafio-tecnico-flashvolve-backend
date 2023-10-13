import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1));
    return 'hashed_value';
  },
}));

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('Should return a hash on success', async () => {
    const sut = new BcryptAdapter();

    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });
});
