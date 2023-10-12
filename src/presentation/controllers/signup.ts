import { MissingParamError } from '../errors/missingParamError';
import { type httpRequest, type httpResponse } from '../protocols/http';
import { badRequest } from '../helpers/httpHelpers';

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
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
