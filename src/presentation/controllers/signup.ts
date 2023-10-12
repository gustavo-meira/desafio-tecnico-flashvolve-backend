import { type httpRequest, type httpResponse } from '../protocols/http';

export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing params: name'),
      };
    };

    return {
      statusCode: 400,
      body: new Error('Missing params: email'),
    };
  }
}
