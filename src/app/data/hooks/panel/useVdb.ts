import { toast } from 'react-toastify';
import {
	FetchPattern,
	ResultsVdbSearch,
	VdbProps,
	VdbService,
	mapVdbSearch,
	useAuthState,
} from '../../';
import { ChangeEvent, useState } from 'react';
import { useParams } from 'react-router';

/* Custom Hook "useInitialVdb" to handle the search result in vdb */
export const useInitialVdb = () => {
	const { getCompany } = useAuthState();
	const { search } = useParams();
	const [searchData, setSearchData] = useState('');
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<VdbProps>>({
		data: null,
		error: null,
		isLoading: false,
	});

	const fetchInitialVdb = async (companyID: string, search: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));

		return VdbService.initializeVdbData(search, companyID)
			.then((response: any) =>
				dispatch({
					data: mapVdbSearch(response),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
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

	const getVdb = () => (data ? data.result ?? [] : ([] as ResultsVdbSearch[]));

	return { getVdb, refetch, isLoading, searchData, handleChange };
};
