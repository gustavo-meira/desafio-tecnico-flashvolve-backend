import { type LoadAllChats } from '@/domain/useCases/loadAllChats';
import { ok, serverError } from '@/presentation/helpers/httpHelpers';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class LoadAllChatsController implements Controller {
  constructor (private readonly loadAllChats: LoadAllChats) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const chats = await this.loadAllChats.loadAll();

      return ok(chats);
    } catch (err) {
      return serverError();
    }
  }
}
