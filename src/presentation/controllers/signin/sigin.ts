import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator,
} from './siginProtocols';
import { badRequest } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.password) {
      return badRequest(new MissingParamError('password'));
    } else if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }

    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'));
    }
  }
}
