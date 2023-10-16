import {
  type AuthenticationModel,
  type Authentication,
  type LoadAccountByEmailRepository,
  type HashComparer,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
} from './dbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepository,
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepo.load(authentication.email);

    if (!account) return null;

    const passwordIsValid = await this.hashComparer.compare(authentication.password, account.password);

    if (!passwordIsValid) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);

    await this.updateAccessTokenRepo.update(account.id, accessToken);

    return accessToken;
  }
}
