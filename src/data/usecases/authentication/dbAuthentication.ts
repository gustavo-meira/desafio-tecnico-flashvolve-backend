import { type AuthenticationModel } from '@/domain/models/authentication';
import { type Authentication } from '@/domain/useCases/authentication';
import { type LoadAccountByEmailRepository } from '@/data/protocols/loadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepo.load(authentication.email);
    return null;
  }
}
