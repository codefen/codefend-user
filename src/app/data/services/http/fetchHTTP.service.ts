import { getCustomBaseAPi, getToken, handleFetchError } from '../..';
import { baseUrl } from '../../utils/config.ts';
import type { HttpRequestOptions, HttpServiceInterface } from './http.service';

export class FetchHttpService implements HttpServiceInterface {
	private static instance: FetchHttpService;
	private abortController: AbortController;
	private session: string;
	private baseUrl;

	constructor() {
		this.abortController = new AbortController();
		this.session = getToken();
		const customAPi = getCustomBaseAPi();
		this.baseUrl = customAPi ? customAPi : baseUrl;
	}

	static getInstance(): FetchHttpService {
		if (!FetchHttpService.instance) {
			FetchHttpService.instance = new FetchHttpService();
		}
		return FetchHttpService.instance;
	}

	async get<T>({
		path = '',
		headers = { Accept: 'application/json' },
		params,
	}: HttpRequestOptions): Promise<T> {
		let url = path ? `${this.baseUrl}${path}` : this.baseUrl;

		if (params) {
			const queryParams = new URLSearchParams(params);
			url += `?${queryParams.toString()}`;
		}

		return fetch(url, {
			method: 'GET',
			headers: headers,
			signal: this.abortController.signal
		}).then((response: Response) => this.handleResponse(response));
	}

	async post<T>({
		body,
		headers,
		path = '',
		insecure,
		requireJson = false,
	}: HttpRequestOptions): Promise<T> {
		let data: any;

		if (!requireJson && !insecure) {
			data = new FormData();
			for (const key in body) {
				if (Object.hasOwnProperty.call(body, key)) {
					data.append(key, body[key]);
				}
			}
			data.append('session', this.session);
            headers = {...headers, 'Content-Type': 'multipart/form-data'};
		} else if (!insecure) {
			data = JSON.stringify({ ...body, session: this.session });
            headers = {...headers, 'Content-Type': 'application/json'};
		} else {
			data = new URLSearchParams();
			for (const key in body) {
				if (Object.hasOwnProperty.call(body, key)) {
					data.append(key, body[key]);
				}
			}
			data.append('session', this.session);
            headers = {...headers, 'Content-Type': 'application/x-www-form-urlencoded'};
		}

		const url = path ? `${this.baseUrl}${path}` : this.baseUrl;
		return fetch(
			`${url}${insecure ? '?' : ''}${insecure ? data.toString() : ''}`,
			{
				method: 'POST',
				headers: {'Content-Type': 'multipart/form-data', ...headers},
				body: !insecure ? data : undefined,
				signal: this.abortController.signal,
			},
		)
			.then((response: Response) => this.handleResponse(response))
			.catch((error: any) => handleFetchError(error));
	}

	cancelRequest(): void {
		this.abortController.abort();
		this.abortController = new AbortController();
	}

	updateUrlInstance(): void {
		const customAPi = getCustomBaseAPi();
		this.baseUrl = customAPi ? customAPi : baseUrl;
	}

	private async handleResponse(response: Response): Promise<any> {
		const contentType = response.headers.get('content-type');

		if (contentType && contentType.includes('application/json')) {
			return response.json();
		} else {
			return response.text();
		}
	}
}
