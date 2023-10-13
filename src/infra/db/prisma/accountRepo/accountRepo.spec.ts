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

describe('AccountPrismaRepo', () => {
  it('Should call prisma with correct values', async () => {
    const sut = new AccountPrismaRepo();
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
});
