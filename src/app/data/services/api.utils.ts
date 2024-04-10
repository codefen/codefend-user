import { toast } from "react-toastify";

export const handleFetchError = (error: any): Promise<any> => {
	if(error.code === "ECONNABORTED"){
		toast.error("Server response timeout, the server is possibly slow");
		return Promise.resolve({
			data: { error: error ?? {}, isAnError: true, isNetworkError: true },
		});
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

export const handleResponse = async (response: Response): Promise<any> => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
}