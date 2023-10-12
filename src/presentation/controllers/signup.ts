import { MissingParamError } from '../errors/missingParamError';
import { type httpRequest, type httpResponse } from '../protocols/http';
import { badRequest } from '../helpers/httpHelpers';

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    };

    return badRequest(new MissingParamError('email'));
  }
}
