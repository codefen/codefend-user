export interface HttpRequestOptions {
    headers?: Record<string, string>;
    body?: Record<string, string>;
    insecure?: boolean;
    requireBodyParams?: boolean;
}
  
export interface HttpServiceInterface {
    get<T>(url: string, options?: HttpRequestOptions): Promise<T>;
    post<T>(url: string, data: any, options?: HttpRequestOptions): Promise<T>;

    cancelRequest(): void;
}