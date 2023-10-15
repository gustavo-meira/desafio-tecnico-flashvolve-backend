import { MissingParamError } from '@/presentation/errors';
import { type HttpRequest, type HttpResponse, type Controller } from '../signup/signupProtocols';
import { badRequest } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return badRequest(new MissingParamError('email'));
  }
}
