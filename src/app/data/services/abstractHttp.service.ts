import { getCustomBaseAPi, getToken } from '@utils/helper.ts';
import type { HttpRequestOptions, HttpServiceInterface } from './http.service.ts';
import { baseUrl } from '../utils/config.ts';

export type RequestIdType = string | 'uniqueRequest';

export abstract class HttpService implements HttpServiceInterface {
  protected abortControllers: Map<string, AbortController>;
  protected baseUrl: string;
  protected session: string;

  constructor() {
    this.abortControllers = new Map();
    this.session = getToken();
    const customAPi = getCustomBaseAPi();
    this.baseUrl = customAPi ? customAPi : baseUrl;
  }

  public get<T>(options: HttpRequestOptions): Promise<T> {
    throw new Error('Method not implemented.');
  }

  public post<T>(options: HttpRequestOptions): Promise<T> {
    throw new Error('Method not implemented.');
  }

  protected getAbortController(requestId: string): AbortController {
    if (!this.abortControllers.has(requestId)) {
      const abortController = new AbortController();
      this.abortControllers.set(requestId, abortController);
    }
    return this.abortControllers.get(requestId)!;
  }

  public updateUrlInstance(): void {
    this.session = getToken();
    const customAPi = getCustomBaseAPi();
    this.baseUrl = customAPi ? customAPi : baseUrl;
  }

  public updateSession(newSession: string): void {
    this.session = newSession;
  }

  public cancelRequest(requestId: RequestIdType): void {
    if (this.abortControllers.has(requestId)) {
      const abortController = this.abortControllers.get(requestId);
      abortController?.abort();
      this.abortControllers.delete(requestId);
    }
  }

  public cancelAll() {
    this.abortControllers.forEach(abort => abort.abort());
    this.abortControllers.clear();
  }

  protected getURL(path: string) {
    if (path) {
      const base = this.baseUrl.replace(/\/index\.php$/, '');
      return `${base}${path.startsWith('/') ? path : '/' + path}`;
    } else {
      return this.baseUrl;
    }
  }
}
