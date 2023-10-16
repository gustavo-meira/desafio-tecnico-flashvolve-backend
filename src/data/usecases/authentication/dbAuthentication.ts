import { type AuthenticationModel } from '@/domain/models/authentication';
import { type Authentication } from '@/domain/useCases/authentication';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';
import { type HashComparer } from '@/data/protocols/hashCompare';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepo.load(authentication.email);

    if (!account) return null;

    await this.hashComparer.compare(authentication.password, account.password);
    return null;
  }
}
