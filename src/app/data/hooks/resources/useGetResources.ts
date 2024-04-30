import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { toast } from 'react-toastify';


export const useGetResources = () => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher(true);

	// - - -  refetch data  - - -
	const getAnyResource = (path?: string) => {
		const companyID = getCompany();
        if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve([]);
		}
		return fetcher<any>('post', {
			body: {
				company_id: companyID,
				model: `resources/${path}`,
				ac: 'view_all',
				childs: "yes"
			},
		}).then(({ data }) => {
			let resources = [];
			if (data.resources) resources = data.resources;
			if (!Boolean(resources.length) && data.disponibles) resources = data.disponibles;
			return resources;
		});
	};

	return { isLoading, getAnyResource };
};