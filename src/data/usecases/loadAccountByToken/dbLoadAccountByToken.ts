import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type AccountModel } from '../addAccount/dbAddAccountProtocols';
import { type Decrypter } from '@/data/protocols/decrypter';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
  ) {}

  async load (accessToken: string): Promise<AccountModel> {
    await this.decrypter.decrypt(accessToken);

    return null;
  }
}
