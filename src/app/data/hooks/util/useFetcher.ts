import { useEffect, useState } from "react";
import { AxiosHttpService } from "../../services/http/axionHTTP.service";
import type { HttpRequestOptions } from "../../services/http/http.service";

export const useFetcher = ()=>{
    const [httpService, setHttpService] = useState<AxiosHttpService | null>(AxiosHttpService.getInstance());
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        httpService?.updateUrlInstance();
      return () => {
        // Limpia el servicio cuando el componente se desmonta
        httpService?.cancelRequest();
        setHttpService(null);
      };
    }, []);

    const fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions)=>{
        setIsLoading(true);
        if(method === "post"){
            return httpService ? httpService.post<T>(options).finally(()=> setIsLoading(false)) : Promise.resolve();
        }
        return httpService ? httpService.get<T>(options).finally(()=> setIsLoading(false)) : Promise.resolve();
    }

    const cancelRequest = ()=>httpService?.cancelRequest();
    
    return [fetcher, cancelRequest, isLoading] as const;
}