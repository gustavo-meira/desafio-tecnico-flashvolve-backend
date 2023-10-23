import { type TokenGenerator } from '../authentication/dbAuthenticationProtocols';
import {
  type AddAccountRepository,
  type AddAccount,
  type AddAccountModel,
  type Hasher,
} from './dbAddAccountProtocols';

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async add (accountData: AddAccountModel): Promise<string> {
    const hashedPassword = await this.hasher.hash(accountData.password);
    const account = await this.addAccountRepository.add(
      { ...accountData, password: hashedPassword },
    );

    const accessToken = this.tokenGenerator.generate(account.id);

    return accessToken;
  };
}
