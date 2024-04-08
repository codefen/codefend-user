import { useState } from 'react';
import { useAuthState } from '../../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useAddMobileResource = () => {
	const [fetcher,_, isLoading] = useFetcher();

	const [androidAddress, setAndroidAddress] = useState('');
	const [iosAddress, setIosAddress] = useState('');
	const { getCompany } = useAuthState();

	const isNotValidData = () => {
		if (androidAddress.length > 165) {
			toast.error('Invalid android address');
			return true;
		}

		if (iosAddress.length > 165) {
			toast.error('Invalid ios address');
			return true;
		}

		if (!iosAddress.trim() && !androidAddress.trim()) {
			toast.error('Kindly fill in field(s)');
			return true;
		}

		return false;
	};

	const handleAddMobileResource = (
		onDone: () => void,
		onClose: () => void,
	) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		if (isNotValidData()) return;

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
				if (data.android_error || data.apple_error || data.isAnError) {
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
				onClose();
			});
	};

	return {
		handleAddMobileResource,
		isAddingMobile: isLoading,
		setIosAddress,
		setAndroidAddress,
	};
};