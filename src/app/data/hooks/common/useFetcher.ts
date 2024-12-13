import { useEffect, useRef, useState } from 'react';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import type { HttpRequestOptions } from '@services/http.service';
import type { AxiosHeaders } from 'axios';

export type Fetcher = <T>(
  method: 'post' | 'get',
  options: HttpRequestOptions
) => Promise<AxiosFetchResponse<T>>;
export type FetchMethodType<T> = (options: HttpRequestOptions) => Promise<T>;

interface AxiosFetchResponse<T> {
  config: any;
  data: T;
  headers: AxiosHeaders;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}

/**
 * Hook personalizado para realizar solicitudes HTTP utilizando Axios.
 * @param isRoot Determina si este es el componente raíz y debe cancelar todas las solicitudes al desmontarse.
 * @returns Un array que contiene una función para realizar solicitudes, una función para cancelar solicitudes y un indicador de carga.
 *
 * Custom hook to make HTTP requests using Axios.
 * @param isRoot Determines if this is the root component and should cancel all requests when unmounting.
 * @returns A array containing a function to make requests, a function to cancel requests, and a loading indicator.
 */
export const useFetcher = (isRoot?: boolean) => {
  // Almacena una instancia de algun servicio HTTP service
  const httpService = useRef<AxiosHttpService | undefined>(AxiosHttpService.getInstance());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!httpService.current) {
      httpService.current = AxiosHttpService.getInstance();
    }
    if (httpService.current) {
      httpService.current?.updateUrlInstance();
    }

    return () => {
      httpService.current = undefined;
    };
  }, []);

  const makeRequest = async <T>(method: 'post' | 'get', options: HttpRequestOptions) => {
    setIsLoading(true);
    try {
      if (!httpService.current) {
        throw new Error('Http service not initialized.');
      }

      //Ejecuta una solicitud (post o get)
      const response = await (httpService.current[method] as FetchMethodType<T>)(options);
      return response;
    } catch (error) {
      console.warn('Error in make request: ', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetcher: Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions) => {
    return makeRequest<AxiosFetchResponse<T>>(method, options);
  };

  const cancelRequest = (requestId: string) => httpService.current?.cancelRequest(requestId);

  return [fetcher, cancelRequest, isLoading] as const;
};
