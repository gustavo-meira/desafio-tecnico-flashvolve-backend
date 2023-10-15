import {
  type HttpRequest,
  type HttpResponse,
  type Controller,
  type EmailValidator,
  type AddAccount,
  type Validation,
} from './signupProtocols';
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { badRequest, created, serverError } from '@/presentation/helpers/httpHelpers';

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {};

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(httpRequest.body);

      if (validationError) {
        return badRequest(validationError);
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({ name, email, password });

      return created(account);
    } catch (error) {
      return serverError();
    }
  }
}
