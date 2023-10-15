import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator,
} from './siginProtocols';
import { badRequest, serverError } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['password', 'email'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email } = httpRequest.body;

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
