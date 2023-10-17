import {
  type AuthenticationModel,
  type Authentication,
  type LoadAccountByEmailRepository,
  type HashComparer,
  type TokenGenerator,
} from './dbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepo.loadByEmail(authentication.email);

    if (!account) return null;

    const passwordIsValid = await this.hashComparer.compare(authentication.password, account.password);

    if (!passwordIsValid) return null;

    const accessToken = this.tokenGenerator.generate(account.id);

    return accessToken;
  }
}
