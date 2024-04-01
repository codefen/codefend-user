import { useEffect, useState } from "react";
import { AxiosHttpService } from "../../services/http/axiosHTTP.service";
import type { HttpRequestOptions } from "../../services/http/http.service";

export type Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions) => Promise<boolean> | Promise<T>;

export const useFetcher = ()=>{
    const [httpService, setHttpService] = useState<AxiosHttpService | null>(AxiosHttpService.getInstance());
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setHttpService(AxiosHttpService.getInstance());
        httpService?.updateUrlInstance();
      return () => {
        setHttpService(null);
      };
    }, [httpService]);

    const fetcher: Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions)=>{
        setIsLoading(true);
        if(method === "post"){
            return httpService ? httpService.post<T>(options).finally(()=> setIsLoading(false)) : Promise.resolve(false);
        }
        return httpService ? httpService.get<T>(options).finally(()=> setIsLoading(false)) : Promise.resolve(false);
    }

    const cancelRequest = ()=>httpService?.cancelRequest();
    
    return [fetcher, cancelRequest, isLoading] as const;
}