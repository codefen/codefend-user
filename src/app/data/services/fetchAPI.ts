import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseUrl } from '../utils/config';
import { getCustomBaseAPi, getToken } from '../utils/helper';
import { toast } from 'react-toastify';

enum HTTP_METHODS {
	POST = 'post',
	GET = 'get',
	PUT = 'put',
	PATCH = 'patch',
	DELETE = 'delete',
	OPTIONS = 'options',
}

interface FetchParams {
	method: HTTP_METHODS;
	path?: string;
	body?: any;
	params?: Record<string, any>;
	headers?: Record<string, string>;
	insecure?: boolean;
}

type FetchWhitoutMethods = Omit<FetchParams, 'method'>;

/**
 * Make an API request using axios.
 *
 * @param {string} method - The HTTP method of the request.
 * @param {string} path - The API path to which the request is made.
 * @param {*} [body] - The body of the request (optional, only for methods that support a body).
 * @param {*} [params] - Request parameters (optional).
 * @param {*} [headers] - Request headers (optional).
 *
 * @returns {Promise} - A Promise that is resolved with the response of the request.
 */
const fetchFromAPI = async ({
	method,
	path,
	body,
	params,
	headers,
	insecure
}: FetchParams): Promise<any> => {
	let token = getToken();
	const customAPi = getCustomBaseAPi();
	const _baseUrl = customAPi ? customAPi : baseUrl;
	const url = path ? `${_baseUrl}${path}` : _baseUrl;
	/**
	 * @type {AxiosRequestConfig} - Axios request configuration.
	 */
	const requestConfig: AxiosRequestConfig = {
		url,
		method,
		headers: {
			'Content-Type': 'multipart/form-data',
			...headers,
		},
	};

	if (method !== HTTP_METHODS.GET && !insecure) {
        const bodyParams = new FormData();

		if (body) {
			for (const key in body) {
				if (Object.hasOwnProperty.call(body, key)) {
					bodyParams.append(key, body[key]);
				}
			}
		}

		if (params) {
			for (const key in params) {
				if (Object.hasOwnProperty.call(params, key)) {
					bodyParams.append(key, params[key]);
				}
			}
		}

		bodyParams.append('session', token);

		requestConfig.data = bodyParams;
	} else {
		if (params) {
			requestConfig.params = { ...params, session: token };
		}
	}

	return axios(requestConfig);
};

/** Make a POST request to the API using @function fetchFromAPIv2. */
export const fetchPOST: ({}: FetchWhitoutMethods) => Promise<
	AxiosResponse<any, any>
> = async ({ path = '', body, params, headers = {}, insecure }) =>
	fetchFromAPI({ method: HTTP_METHODS.POST, path, body, params, headers, insecure });

/** Make a PUT request to the API using @function fetchFromAPIv2. */
export const fetchPUT: ({}: FetchWhitoutMethods) => Promise<
	AxiosResponse<any, any>
> = async ({ path = '', body, params, headers, insecure }) =>
	fetchFromAPI({ method: HTTP_METHODS.PUT, path, body, params, headers, insecure });

/** Make a GET request to the API using @function fetchFromAPIv2. */
export const fetchGET = async ({
	path = '',
	params,
	headers,
}: FetchWhitoutMethods) =>
	fetchFromAPI({
		method: HTTP_METHODS.GET,
		path,
		body: null,
		params,
		headers,
	});

/** Make a PATCH request to the API using @function fetchFromAPIv2. */
export const fetchPATH: ({}: FetchWhitoutMethods) => Promise<
	AxiosResponse<any, any>
> = async ({ path = '', body, params, headers }) =>
	fetchFromAPI({ method: HTTP_METHODS.PATCH, path, body, params, headers });

/** Make a DELETE request to the API using @function fetchFromAPIv2. */
export const fetchDELETE: ({}: FetchWhitoutMethods) => Promise<
	AxiosResponse<any, any>
> = async ({ path = '', params, headers }) =>
	fetchFromAPI({
		method: HTTP_METHODS.DELETE,
		path,
		body: null,
		params,
		headers,
	});

export const handleFetchError = (error: any) => {
	if (
		error.name === 'AxiosError' &&
		(error.message === 'Network Error' ||
			error.message === 'Request failed with status code 500')
	) {
		localStorage.setItem('error', JSON.stringify(true));
		window.dispatchEvent(new Event('errorState'));
		return {
			data: { error: error ?? {}, isAnError: true, isNetworkError: true },
		};
	}
	if (error.response?.data) {
		const message = error.response.data.message;
		console.log(error.response.data);
		message && toast.error(message);
	}

	return {
		data: { error: error ?? {}, isAnError: true, isNetworkError: true },
	};
};
