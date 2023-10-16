import { type AuthenticationModel } from '@/domain/models/authentication';
import { type Authentication } from '@/domain/useCases/authentication';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';
import { type HashComparer } from '@/data/protocols/hashCompare';
import { type TokenGenerator } from '@/data/protocols/tokenGenerator';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepo.load(authentication.email);

    if (!account) return null;

    const passwordIsValid = await this.hashComparer.compare(authentication.password, account.password);

    if (!passwordIsValid) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);

    return accessToken;
  }
}
