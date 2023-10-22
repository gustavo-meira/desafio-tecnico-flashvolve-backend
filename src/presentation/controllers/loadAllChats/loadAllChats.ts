import { type LoadAllChats } from '@/domain/useCases/loadAllChats';
import { serverError } from '@/presentation/helpers/httpHelpers';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class LoadAllChatsController implements Controller {
  constructor (private readonly loadAllChats: LoadAllChats) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadAllChats.loadAll();

      return null;
    } catch (err) {
      return serverError();
    }
  }
}
