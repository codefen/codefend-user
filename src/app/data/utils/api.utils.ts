import { toast } from "react-toastify";

export const handleFetchError = (error: any): Promise<any> => {
	if (error.name === 'AxiosError' && !error.message.startsWith("timeout")) {
		localStorage.setItem('error', JSON.stringify(true));
		window.dispatchEvent(new Event('errorState'));
		return Promise.resolve({
			data: { error: error ?? {}, isAnError: true, isNetworkError: true },
		});
	}
	if (error.response?.data) {
		const message = error.response.data.message;
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