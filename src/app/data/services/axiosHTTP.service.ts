import type { AxiosRequestConfig } from 'axios';
import type { HttpRequestOptions } from './http.service.ts';
import axios from 'axios';
import { handleFetchError } from '../utils/api.utils.ts';
import { HttpService } from './abstractHttp.service.ts';

/**
 * Implementacion de HttpService utilizando Axios, para realizar las solicitudes HTTP
 *
 * @see {HttpService}
 */
export class AxiosHttpService extends HttpService {
  /**
   * Instancia singleton de AxiosHttpService
   */
  private static instance: AxiosHttpService;

  /**
   * Recupera el instancia singleton de AxiosHttpService
   * @returns AxiosHttpService
   */
  public static getInstance(): AxiosHttpService {
    if (!AxiosHttpService.instance) {
      AxiosHttpService.instance = new AxiosHttpService();
    }
    return AxiosHttpService.instance;
  }

  public override async get<T>({
    path = '',
    headers = { Accept: 'application/json' },
    params,
    requestId = 'uniqueRequest',
    requireSession = true,
    timeout = 40000,
  }: HttpRequestOptions): Promise<T> {
    const abortController = this.getAbortController(requestId);
    const requestConfig: AxiosRequestConfig = {
      headers,
    };

    if (params) {
      requestConfig.params = params;
    }
    if (requireSession) {
      requestConfig.params = { ...params, session: this.session };
    }

    return axios({
      ...requestConfig,
      url: this.getURL(path),
      signal: abortController.signal,
      method: 'GET',
      timeout: timeout,
    }).catch((error: any) => handleFetchError(error));
  }

  public override async post<T>({
    body,
    headers,
    path = '',
    insecure,
    requireJson = false,
    timeout = 40000,
    requestId = 'uniqueRequest',
    requireSession = true,
  }: HttpRequestOptions): Promise<T> {
    const insecureStore = localStorage.getItem('a20af8d9') == 'true' ? true : false;
    insecure = insecureStore ? insecureStore : insecure;
    const abortController = this.getAbortController(requestId);
    let data = requireSession ? { ...body, session: this.session } : body;
    const requestConfig: AxiosRequestConfig = {
      headers: { ...headers, 'Content-Type': 'multipart/form-data' },
    };

    if (!requireJson && !insecure) {
      const formData = new FormData();
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          formData.append(key, data[key]);
        }
      }
      requestConfig.data = formData;
    } else if (insecure) {
      requestConfig.params = data;
      requestConfig.headers = { ...requestConfig.headers, 'Content-Type': 'application/json' };
    } else {
      requestConfig.data = data;
      requestConfig.headers = {
        ...requestConfig.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    }

    return axios({
      ...requestConfig,
      url: this.getURL(path),
      signal: abortController.signal,
      method: 'POST',
      timeout: timeout,
    }).catch((error: any) => handleFetchError(error));
  }
}
