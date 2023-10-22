import { type HttpRequest, type Controller, type HttpResponse, type Validation } from '../signup/signupProtocols';

export class AddMessageController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body);

    return null;
  }
}
