import {
  type AddAccountRepository,
  type AccountModel,
  type AddAccount,
  type AddAccountModel,
  type Encrypter,
} from './dbAddAccountProtocols';

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add(
      { ...accountData, password: hashedPassword },
    );

    return account;
  };
}
