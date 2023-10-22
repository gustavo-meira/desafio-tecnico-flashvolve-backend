import { type AddAccountRepository } from '@/data/protocols/addAccountRepository';
import { type AccountModel } from '@/domain/models/account';
import { type AddAccountModel } from '@/domain/useCases/addAccount';
import { prismaDB } from '../lib/db';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';
import { type LoadAccountByIdRepository } from '@/data/protocols/loadAccountByIdRepository';

export class AccountPrismaRepo implements
AddAccountRepository,
LoadAccountByEmailRepository,
LoadAccountByIdRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await prismaDB.user.create({
      data: accountData,
    });

    return account;
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const account = await prismaDB.user.findUnique({
      where: {
        email,
      },
    });

    return account;
  }

  async loadById (id: string): Promise<AccountModel> {
    await prismaDB.user.findFirst({
      where: {
        id,
      },
    });

    return null;
  }
}
