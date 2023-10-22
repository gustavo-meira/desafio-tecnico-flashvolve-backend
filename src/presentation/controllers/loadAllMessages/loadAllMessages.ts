import { type Validation, type Controller, type HttpRequest, type HttpResponse } from '../signup/signupProtocols';

export class LoadAllMessagesController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);

    return null;
  }
}
