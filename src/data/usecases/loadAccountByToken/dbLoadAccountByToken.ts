import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type AccountModel } from '../addAccount/dbAddAccountProtocols';
import { type Decrypter } from '@/data/protocols/decrypter';
import { type LoadAccountByIdRepository } from '@/data/protocols/loadAccountByIdRepository';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
  ) {}

  async load (accessToken: string): Promise<AccountModel> {
    const id = await this.decrypter.decrypt(accessToken);

    if (id) {
      await this.loadAccountByIdRepository.loadById(id);
    }

    return null;
  }
}
