import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middleware';

interface AuthMiddlewareParams {
  accessToken: string;
};

export class AuthMiddleware implements Middleware<AuthMiddlewareParams> {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
  ) {}

  async handle (request: AuthMiddlewareParams): Promise<HttpResponse> {
    await this.loadAccountByToken.load(request.accessToken);

    return null;
  }
}
