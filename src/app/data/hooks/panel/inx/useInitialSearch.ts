import { useRef, useState } from 'react';
import { InxServices } from '../../../';
import { toast } from 'react-toastify';

interface SearchResult {
	intelID: string;
	count: number;
	offSet: number;
	search: string;

	isLoading: boolean;
}

export const useInitialSearch = () => {
	const emptyState = {
		count: 0,
		offSet: 0,
		intelID: '',
		search: '',
		isLoading: false,
	};
	const intelData = useRef([]);

	const [dataSearch, setSearchData] = useState<SearchResult>(emptyState);

	const fetchInitialSearch = async (companyID: string, term: string) => {
		setSearchData((state: SearchResult) => ({
			...state,
			offSet: 0,
			search: term,
		}));

		return InxServices.initializeSearch(term, companyID)
			.then((res: any) => {
				res = JSON.parse(String(res).trim());

				if (res.error == '1') throw new Error('An unexpected error has occurred');

				setSearchData((state: SearchResult) => ({
					...state,
					intelID: res.response.id || '',
					count: res.response.count || 0,
					isLoading: false,
				}));
				return res.response.id;
			})
			.catch((e: Error) =>
				{
					setSearchData((state: SearchResult) => ({
						...state,
						isLoading: false,
					}));

					toast.error(e.message);
					return {error: 1};
				}
			);
	};

	const refetchInitial = (companyID: string, term: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchInitialSearch(companyID, term);
	};

	const getData = (): SearchResult => dataSearch;

	return { getData, setSearchData, refetchInitial, intelData };
};
