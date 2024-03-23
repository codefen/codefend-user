import { toast } from 'react-toastify';
import {
	type ResultsVdbSearchV2,
	VdbService,
	mapVdbResultV2,
	useAuthState,
} from '../../';
import { type ChangeEvent, useRef, useState } from 'react';
import { useParams } from 'react-router';

/* Custom Hook "useInitialVdb" to handle the search result in vdb */
export const useInitialVdb = () => {
	const { getCompany } = useAuthState();
	const { search } = useParams();
	const [searchData, setSearchData] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const vdbResults = useRef<ResultsVdbSearchV2[]>([]);

	const fetchInitialVdb = async (companyID: string, search: string) => {
		setIsLoading(true);

		return VdbService.initializeVdbData(search, companyID)
			.then((response: any) =>
				{
				vdbResults.current = response ? response.map((result: any)=> mapVdbResultV2(result)) : [];
			}
			).finally(()=> setIsLoading(false));
	};

	const refetch = () => {
		setSearchData(search ?? '');
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchInitialVdb(companyID, searchData);
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchData(e.target.value);
	};

	return { vdbResults, refetch, isLoading, searchData, handleChange };
};
