import { HttpService } from './abstractHttp.service.ts';
import { handleFetchError, handleResponse } from '../utils/api.utils.ts';
import type { HttpRequestOptions } from './http.service';

export class FetchHttpService extends HttpService {
  /**
   * Instancia singleton de AxiosHttpService
   */
  private static instance: FetchHttpService;

  /**
   * Recupera el instancia singleton de AxiosHttpService
   * @returns AxiosHttpService
   */
  static getInstance(): FetchHttpService {
    if (!FetchHttpService.instance) {
      FetchHttpService.instance = new FetchHttpService();
    }
    return FetchHttpService.instance;
  }

  public override async get<T>({
    path = '',
    headers = { Accept: 'application/json' },
    params,
    requestId = 'uniqueRequest',
    requireSession = true,
  }: HttpRequestOptions): Promise<T> {
    const abortController = this.getAbortController(requestId);
    let queryParams: URLSearchParams | undefined;
    if (params) queryParams = new URLSearchParams(params);
    if (requireSession) {
      if (queryParams) queryParams = new URLSearchParams();
      queryParams?.append('session', this.session);
    }

    return fetch(`${this.getURL(path)}${queryParams ? `?${queryParams.toString()}` : ''}`, {
      method: 'GET',
      headers: headers,
      signal: abortController.signal,
    })
      .then((response: Response) => handleResponse(response))
      .catch((error: any) => handleFetchError(error));
  }

  public override async post<T>({
    body,
    headers,
    path = '',
    insecure,
    requireJson = false,
    requestId = 'uniqueRequest',
    requireSession = true,
  }: HttpRequestOptions): Promise<T> {
    const insecureStore = localStorage.getItem('a20af8d9') == 'true' ? true : false;
    insecure = insecureStore ? insecureStore : insecure;
    const abortController = this.getAbortController(requestId);
    let data = requireSession ? { ...body, session: this.session } : body;

    if (!requireJson && !insecure) {
      const formData = new FormData();
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
      data = formData;
    } else if (insecure) {
      const urlParam = new URLSearchParams();
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          urlParam.append(key, data[key]);
        }
      }
      data = urlParam;
      headers = { ...headers, 'Content-Type': 'application/json' };
    } else {
      data = JSON.stringify({ ...body, session: this.session });
      headers = {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    }

    return fetch(`${this.getURL(path)}${insecure ? `?${data.toString()}` : ''}`, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data', ...headers },
      body: !insecure ? data : undefined,
      signal: abortController.signal,
    })
      .then((response: Response) => handleResponse(response))
      .catch((error: any) => handleFetchError(error));
  }
}
