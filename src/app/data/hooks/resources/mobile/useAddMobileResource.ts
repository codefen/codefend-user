import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { androidUriValidation, apiErrorValidation, companyIdIsNotNull, iosUriValidation } from '@/app/constants/validations';

export const useAddMobileResource = () => {
	const [fetcher,_, isLoading] = useFetcher();

	const [androidAddress, setAndroidAddress] = useState('');
	const [iosAddress, setIosAddress] = useState('');
	const { getCompany } = useUserData();

	const isNotValidData = () => {
		if (androidUriValidation( androidAddress) ) {
			toast.error('Invalid android address');
			return true;
		}

		if (iosUriValidation( iosAddress) ) {
			toast.error('Invalid ios address');
			return true;
		}

		if(iosAddress.trim() === "" && androidAddress.trim() === ""){
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
		if (companyIdIsNotNull(companyID)) return;
		if (isNotValidData()) {
			return;
		}

		fetcher<any>('post', {
			body: {
				model: 'resources/mobile',
				ac: 'add',
				app_android_link: androidAddress,
				app_apple_link: iosAddress,
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				if (data.android_error || data.apple_error || apiErrorValidation(data?.error, data?.response)) {
					throw new Error(
						data?.android_info || 'An error has occurred on the server',
					);
				}

				onDone();
				onClose();
				toast.success('Successfully Added Mobile App...');
			})
			.catch((error: Error) => {
				toast.error(error.message);
			});
	};

	return {
		handleAddMobileResource,
		isAddingMobile: isLoading,
		setIosAddress,
		setAndroidAddress,
	};
};
