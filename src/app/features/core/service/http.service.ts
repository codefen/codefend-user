export interface HttpRequestOptions {
  headers?: Record<string, string>;
  insecure?: boolean;
  requireJson?: boolean;
  fetchPriority?: 'auto' | 'low' | 'medium' | 'high';
  path?: string;
  params?: Record<string, string>;
  body?: any;
  timeout?: number;
  requestId?: string;
  requireSession?: boolean;
}

export interface HttpServiceInterface {
  get<T>(options: HttpRequestOptions): Promise<T>;
  post<T>(options: HttpRequestOptions): Promise<T>;
}
