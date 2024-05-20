import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, CLOUD_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useAddCloud = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();

	const fetchAdd = (companyID: string,app:string,provider:string,desc:string) => {
		return fetcher('post', {
			body: {
				model: 'resources/cloud',
				ac: 'add',
				company_id: companyID,
				llave_1: '',
				llave_2: '',
				llave_3: '',
				provider: provider,
				name: app,
				desc: desc,
			},
		}).then(({ data }: any) => {
			if (data?.isAnError || apiErrorValidation(data?.error, data?.response)) {
				throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
			}

			onDone();
			close();
			toast.success(CLOUD_PANEL_TEXT.ADD_CLOUD);
			return data;
		}).catch((e: Error)=> toast.error(e.message) );
	};

	const refetch = (app:string,provider:string,desc:string) => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return Promise.reject(false);
		return fetchAdd(companyID,app,provider,desc);
	};

	const validations = (app:string,prov:string) => {
		if (!prov.trim()) {
			toast.error(CLOUD_PANEL_TEXT.EMPTY_CLOUD_PROV);
			return true;
		}

		if (!app.trim() || app.length > 150) {
			toast.error(CLOUD_PANEL_TEXT.EMPTY_CLOUD_NAME);
			return true;
		}
		return false;
	};

	return {
		refetch,
		isAddingCloud: isLoading,
		validations,
	};
};
