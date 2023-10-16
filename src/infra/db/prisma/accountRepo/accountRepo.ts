import { type AddAccountRepository } from '@/data/protocols/addAccountRepository';
import { type AccountModel } from '@/domain/models/account';
import { type AddAccountModel } from '@/domain/useCases/addAccount';
import { prismaDB } from '../lib/db';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';

export class AccountPrismaRepo implements AddAccountRepository, LoadAccountByEmailRepository {
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
}
