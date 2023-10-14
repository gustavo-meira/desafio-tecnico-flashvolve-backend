import { AccountPrismaRepo } from './accountRepo';
import { prismaDB } from '../lib/db';
import Chance from 'chance';

const chance = new Chance();

const accountData = {
  name: chance.name(),
  email: chance.email(),
  password: chance.string(),
};

const accountDataWithId = {
  id: chance.guid(),
  ...accountData,
};

jest.mock('../lib/db', () => ({
  prismaDB: {
    user: {
      async create () {
        await new Promise((resolve) => setTimeout(resolve, 1));

        return accountDataWithId;
      },
    },
  },
}));

const makeSut = (): AccountPrismaRepo => {
  const sut = new AccountPrismaRepo();

  return sut;
};

describe('AccountPrisma Repository', () => {
  it('Should call prisma with correct values', async () => {
    const sut = makeSut();
    const createSpy = jest.spyOn(prismaDB.user, 'create');

    await sut.add(accountData);
    expect(createSpy).toHaveBeenCalledWith({
      data: accountData,
    });
  });

  it('Should return an account on success', async () => {
    const sut = makeSut();

    const account = await sut.add(accountData);
    expect(account).toEqual(accountDataWithId);
  });

  it('Should throw if prisma throw', async () => {
    const sut = makeSut();
    jest.spyOn(prismaDB.user, 'create').mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
