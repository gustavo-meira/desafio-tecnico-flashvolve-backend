import { MissingParamError } from '../errors/missingParamError';
import { badRequest } from '../helpers/httpHelpers';
import { type HttpRequest, type HttpResponse } from '../protocols/http';
import { type Controller } from '../protocols/controller';

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      };
    };

    return {
      statusCode: 400,
      body: new MissingParamError('any_param'),
    };
  }
}
