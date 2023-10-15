import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator,
  type Authentication,
} from './siginProtocols';
import { badRequest, serverError, unauthorized } from '@/presentation/helpers/httpHelpers';

export class SignInController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['password', 'email'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(httpRequest.body);

      if (!accessToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError();
    }
  }
}
