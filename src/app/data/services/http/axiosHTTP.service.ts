import type { AxiosRequestConfig } from 'axios';
import { getCustomBaseAPi, getToken, handleFetchError } from '../../index.ts';
import { baseUrl } from '../../utils/config.ts';
import type { HttpRequestOptions, HttpServiceInterface } from './http.service.ts';
import axios from 'axios';

export class AxiosHttpService implements HttpServiceInterface {
	private static instance: AxiosHttpService;
	private abortController: AbortController;
	private session: string;
	private baseUrl;

	constructor() {
		this.abortController = new AbortController();
		this.session = getToken();
		const customAPi = getCustomBaseAPi();
		this.baseUrl = customAPi ? customAPi : baseUrl;
	}

	static getInstance(): AxiosHttpService {
		if (!AxiosHttpService.instance) {
			AxiosHttpService.instance = new AxiosHttpService();
		}
		return AxiosHttpService.instance;
	}

	async get<T>({
		path = '',
		headers = { Accept: 'application/json' },
		params,
	}: HttpRequestOptions): Promise<T> {
		const requestConfig: AxiosRequestConfig = {
			headers
		};

        if (params) {
			requestConfig.params = { ...params, session: this.session };
		}

		const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
		return axios({
			...requestConfig,
			url: url,
			signal: this.abortController.signal,
			method: 'POST',
		}).catch((error: any) => handleFetchError(error));
	}
    
	async post<T>({
		body,
		headers,
		path = '',
		insecure,
		requireJson = false,
		timeout=8000
	}: HttpRequestOptions): Promise<T> {
		let data: any;
		let contentType: string;
		const requestConfig: AxiosRequestConfig = {
			headers
		};

		if (!requireJson && !insecure) {
			data = new FormData();
			for (const key in body) {
				if (Object.hasOwnProperty.call(body, key)) {
					data.append(key, body[key]);
				}
			}
			data.append('session', this.session);
			requestConfig.headers = {...requestConfig.headers, 'Content-Type': 'multipart/form-data'};
			requestConfig.data = data;
		} else if (!insecure) {
			data = { ...body, session: this.session };
			requestConfig.headers = {...requestConfig.headers, 'Content-Type': 'application/json'};
			requestConfig.data = data;
		} else {
			data = { ...body, session: this.session };
			requestConfig.headers = {...requestConfig.headers,'Content-Type': 'application/x-www-form-urlencoded'};
			requestConfig.params = data;
		}

		const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
		return axios({
			...requestConfig,
			url: url,
			signal: this.abortController.signal,
			method: 'POST',
			timeout: timeout,
		}).catch((error: any) => handleFetchError(error));
	}

	cancelRequest(): void {
		this.abortController.abort();
		this.abortController = new AbortController();
	}

	updateUrlInstance(): void {
		this.session = getToken();
		const customAPi = getCustomBaseAPi();
		this.baseUrl = customAPi ? customAPi : baseUrl;
	}
}
