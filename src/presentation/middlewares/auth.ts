import { type LoadAccountByToken } from '@/domain/useCases/loadAccountByToken';
import { type HttpResponse } from '../protocols';
import { type Middleware } from '../protocols/middleware';
import { forbidden, serverError } from '../helpers/httpHelpers';
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
      await this.loadAccountByToken.load(request.accessToken);

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError();
    }
  }
}
