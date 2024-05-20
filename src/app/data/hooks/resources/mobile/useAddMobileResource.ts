import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { androidUriValidation, apiErrorValidation, companyIdIsNull, iosUriValidation } from '@/app/constants/validations';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { APP_MESSAGE_TOAST, MOBILE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export const useAddMobileResource = () => {
	const { setNewApp } = useSelectedApp();
	const [fetcher,_, isLoading] = useFetcher();
	const androidAddress = useRef<HTMLInputElement>(null);
	const iosAddress = useRef<HTMLInputElement>(null);
	const { getCompany } = useUserData();

	const isNotValidData = () => {
		if (androidUriValidation( androidAddress.current?.value || "") ) {
			toast.error(MOBILE_PANEL_TEXT.INVALID_ANDROID);
			return true;
		}

		if (iosUriValidation( iosAddress.current?.value || "") ) {
			toast.error(MOBILE_PANEL_TEXT.INVALID_IOS);
			return true;
		}

		if((iosAddress.current?.value === undefined || iosAddress.current?.value?.trim() === "") && (androidAddress.current?.value === undefined || androidAddress.current?.value?.trim() === "")){
			toast.error(MOBILE_PANEL_TEXT.EMPTY_MOBILE_APP);
			return true;
		}

		return false;
	};

	const handleAddMobileResource = (
		onDone: () => void,
		onClose: () => void,
	) => {
		const companyID = getCompany();
		if (isNotValidData() || companyIdIsNull(companyID)) return;
	
		fetcher<any>('post', {
			body: {
				model: 'resources/mobile',
				ac: 'add',
				app_android_link: androidAddress.current?.value || "",
				app_apple_link: iosAddress.current?.value || "",
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				if (data.android_error || data.apple_error || apiErrorValidation(data?.error, data?.response)) {
					throw new Error(
						data?.android_info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR
					);
				}
				setNewApp({android: data?.android, apple: data?.apple});
				toast.success(MOBILE_PANEL_TEXT.ADD_MOBILE);
				onClose();
				onDone();
			})
			.catch((error: Error) => {
				toast.error(error.message);
			});
	};

	return {
		handleAddMobileResource,
		isAddingMobile: isLoading,
		iosAddress,
		androidAddress,
	};
};
