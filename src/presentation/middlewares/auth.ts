import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middleware';
import { forbidden, ok, serverError } from '../helpers/httpHelpers';
import { AccessDeniedError } from '../errors';

interface AuthMiddlewareParams {
  accessToken?: string;
};

export class AuthMiddleware implements Middleware<AuthMiddlewareParams> {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
  ) {}

  async handle (request: AuthMiddlewareParams): Promise<HttpResponse> {
    try {
      if (request.accessToken) {
        const account = await this.loadAccountByToken.load(request.accessToken);

        if (account) {
          return ok({ accountId: account.id });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError();
    }
  }
}
