import { AccountPrismaRepo } from './accountRepo';
import { prismaDB } from '../lib/db';

jest.mock('../lib/db', () => ({
  prismaDB: {
    user: {
      async create () {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@email.com',
          password: 'any_password',
        };
      },
    },
  },
}));

const makeSut = (): AccountPrismaRepo => {
  const sut = new AccountPrismaRepo();

  return sut;
};

describe('AccountPrismaRepo', () => {
  it('Should call prisma with correct values', async () => {
    const sut = makeSut();
    const createSpy = jest.spyOn(prismaDB.user, 'create');
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    };

    await sut.add(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      data: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
      },
    });
  });

  it('Should return an account on success', async () => {
    const sut = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    };

    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    });
  });

  it('Should throw if prisma throw', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.user, 'create').mockImplementationOnce(() => {
      throw new Error();
    });
    const accountData = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
