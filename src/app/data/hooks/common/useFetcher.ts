import { useEffect, useState } from "react";
import { AxiosHttpService } from "../../services/axiosHTTP.service";
import type { HttpRequestOptions } from "../../services/http.service";

export type Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions) => Promise<T>;
export type FetchMethodType<T> = (options: HttpRequestOptions) => Promise<T>;

export const useFetcher = ()=>{
    const [httpService, setHttpService] = useState<AxiosHttpService>();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      setHttpService(AxiosHttpService.getInstance());
      if(httpService) httpService?.updateUrlInstance();
      return () => {
        httpService?.cancelAll();
        setHttpService(undefined);
      };
    }, [httpService]);

    const makeRequest = async <T>(
      method: 'post' | 'get', options: HttpRequestOptions
    ) => {
      setIsLoading(true);
      try {
        if (!httpService) {
          throw new Error('Http service not initialized.');
        }

        const response = await (httpService[method] as FetchMethodType<T>)(
          options,
        );
        return response;
      } catch (error) {
        console.warn('Error in make request: ', error);
        return Promise.reject(error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetcher: Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions)=>{
        const insecure = sessionStorage.getItem("insecure");
        return makeRequest<T>(method, options);
    }

    const cancelRequest = (requestId: string)=>httpService?.cancelRequest(requestId);
    
    return [fetcher, cancelRequest, isLoading] as const;
}

