import { useEffect, useState } from "react";
import { AxiosHttpService } from "../../services/axiosHTTP.service";
import type { HttpRequestOptions } from "../../services/http.service";
import type { AxiosHeaders } from "axios";

export type Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions) => Promise<AxiosFetchResponse<T>>;
export type FetchMethodType<T> = (options: HttpRequestOptions) => Promise<T>;

interface AxiosFetchResponse<T> {
	config: any;
	data: T;
	headers: AxiosHeaders;
	request: XMLHttpRequest;
	status: number;
	statusText: string;
}

export const useFetcher = (isRoot?: boolean)=>{
    const [httpService, setHttpService] = useState<AxiosHttpService | undefined>(AxiosHttpService.getInstance());
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
      setHttpService(AxiosHttpService.getInstance());
      if(httpService) httpService?.updateUrlInstance();
      return () => {
        if(isRoot) httpService?.cancelAll();
        setHttpService(undefined);
      };
    }, []);

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
        return makeRequest<AxiosFetchResponse<T>>(method, options);
    }

    const cancelRequest = (requestId: string)=>httpService?.cancelRequest(requestId);
    
    return [fetcher, cancelRequest, isLoading] as const;
}

