import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { androidUriValidation, apiErrorValidation, companyIdIsNull, iosUriValidation } from '@/app/constants/validations';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';

export const useAddMobileResource = () => {
	const { setNewApp } = useSelectedApp();
	const [fetcher,_, isLoading] = useFetcher();
	const androidAddress = useRef<HTMLInputElement>(null);
	const iosAddress = useRef<HTMLInputElement>(null);
	const { getCompany } = useUserData();

	const isNotValidData = () => {
		if (androidUriValidation( androidAddress.current?.value || "") ) {
			toast.error('Invalid android address');
			return true;
		}

		if (iosUriValidation( iosAddress.current?.value || "") ) {
			toast.error('Invalid ios address');
			return true;
		}

		if((iosAddress.current?.value === undefined || iosAddress.current?.value?.trim() === "") && (androidAddress.current?.value === undefined || androidAddress.current?.value?.trim() === "")){
			toast.error('Please add at least one Android or iOS app');
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
						data?.android_info || 'An error has occurred on the server',
					);
				}
				setNewApp({android: data?.android, apple: data?.apple});
				toast.success('Successfully Added Mobile App...');
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
