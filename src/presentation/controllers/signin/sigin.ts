import { MissingParamError } from '@/presentation/errors';
import { type HttpRequest, type HttpResponse, type Controller } from '../signup/signupProtocols';
import { badRequest } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'));
    } else if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
