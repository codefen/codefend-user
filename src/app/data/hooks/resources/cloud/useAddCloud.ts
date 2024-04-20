import { useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export const useAddCloud = (onDone: () => void, close: () => void) => {
	const { getCompany } = useUserData();
	const [appName, setAppName] = useState('');
	const [provider, setProvider] = useState('');
	const [description, setDescription] = useState('');
	const [fetcher, _, isLoading] = useFetcher();

	const fetchAdd = (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'resources/cloud',
				ac: 'add',
				company_id: companyID,
				llave_1: '',
				llave_2: '',
				llave_3: '',
				provider: provider,
				name: appName,
				desc: description,
			},
		}).then(({ data }: any) => {
			if (data?.isAnError || data.response === "error") {
				throw new Error('An error has occurred on the server');
			}

			onDone();
			close();
			toast.success('Successfully Added Cloud...');
		}).catch((e: Error)=> toast.error(e.message) );
	};

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchAdd(companyID);
	};

	const validations = () => {
		if (!provider.trim()) {
			toast.error('Select cloud provider');
			return true;
		}

		if (!appName.trim() || appName.length > 150) {
			toast.error('Invalid app name');
			return true;
		}
		return false;
	};

	return {
		provider,
		refetch,
		isAddingCloud: isLoading,
		setAppName,
		setProvider,
		setDescription,
		validations,
	};
};
