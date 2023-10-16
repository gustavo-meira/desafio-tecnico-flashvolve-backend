import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type Authentication,
  type Validation,
} from './siginProtocols';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);

      if (error) {
        return badRequest(error);
      }

      const accessToken = await this.authentication.auth(httpRequest.body);

      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError();
    }
  }
}
