import { type AccountModel } from '../../../domain/models/account';
import { type AddAccount, type AddAccountModel } from '../../../domain/useCases/addAccount';
import { type Encrypter } from '../../protocols/encrypter';

export class DBAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return null;
  };
}
