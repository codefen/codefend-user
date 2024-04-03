import { useEffect, useState } from "react";
import { AxiosHttpService } from "../../services/http/axiosHTTP.service";
import type { HttpRequestOptions } from "../../services/http/http.service";
import { toast } from "react-toastify";

export type Fetcher = <T>(method: 'post' | 'get', options: HttpRequestOptions) => Promise<boolean> | Promise<T>;

const handleFetchError = (error: any): Promise<any> => {
	if(error.code === "ECONNABORTED"){
		toast.error("Server response timeout, the server is possibly slow");
	}
	if (
		error.name === 'AxiosError' &&
		(error.message === 'Network Error' ||
			error.message === 'Request failed with status code 500')
	) {
		localStorage.setItem('error', JSON.stringify(true));
		window.dispatchEvent(new Event('errorState'));
		return Promise.resolve({
			data: { error: error ?? {}, isAnError: true, isNetworkError: true },
		});
	}
	if (error.response?.data) {
		const message = error.response.data.message;
		console.log(error.response.data);
		message && toast.error(message);
	}

	return Promise.resolve({
		data: { error: error ?? {}, isAnError: true, isNetworkError: true },
	});
};

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