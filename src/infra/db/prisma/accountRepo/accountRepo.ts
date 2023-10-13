import { type AddAccountRepository } from '@/data/protocols/addAccountRepository';
import { type AccountModel } from '@/domain/models/account';
import { type AddAccountModel } from '@/domain/useCases/addAccount';
import { prismaDB } from '../lib/db';

export class AccountPrismaRepo implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const account = await prismaDB.user.create({
      data: accountData,
    });

    return account;
  }
}
