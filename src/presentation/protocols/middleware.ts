import { type HttpResponse } from '.';

export interface Middleware<T> {
  handle: (httpRequest: T) => Promise<HttpResponse>;
}
