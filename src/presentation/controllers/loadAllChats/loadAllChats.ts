import { type LoadAllChats } from '@/domain/useCases/loadAllChats';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

export class LoadAllChatsController implements Controller {
  constructor (private readonly loadAllChats: LoadAllChats) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.loadAllChats.loadAll();

    return null;
  }
}
