import { badRequest } from '@/presentation/helpers/httpHelpers';
import { type Validation, type Controller, type HttpRequest, type HttpResponse } from '../signup/signupProtocols';

export class LoadAllMessagesController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);

    if (error) {
      return badRequest(error);
    }

    return null;
  }
}
