import {
  type AccountModel,
  type AddAccount,
  type AddAccountModel,
  type Encrypter,
} from './dbAddAccountProtocols';

export class DBAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return null;
  };
}
