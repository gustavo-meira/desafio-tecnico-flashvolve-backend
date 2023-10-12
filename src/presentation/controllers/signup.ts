import { MissingParamError } from '../errors/missingParamError';
import { InvalidParamError } from '../errors/invalidParamError';
import { badRequest } from '../helpers/httpHelpers';
import { type HttpRequest, type HttpResponse } from '../protocols/http';
import { type Controller } from '../protocols/controller';
import { type EmailValidator } from '../protocols/emailValidator';
import { ServerError } from '../errors/serverError';

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {};

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        };
      };

      const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
