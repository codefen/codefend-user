import { useState } from 'react';
import { useParams } from 'react-router';
import { InxServices } from '../../../';
import { toast } from 'react-toastify';

interface SearchResult {
	intelData: any[];
	search: string;
	intelID: string;
	count: number;
	offSet: number;

	isLoading: boolean;
}

export const useInitialSearch = () => {
	const { search } = useParams();
	const emptyState = {
		intelData: [],
		count: 0,
		offSet: 0,
		intelID: '',
		search: search ?? '',
		isLoading: true,
	};

	const [dataSearch, setSearchData] = useState<SearchResult>(emptyState);

	const fetchInitialSearch = async (companyID: string) => {
		setSearchData((state: SearchResult) => ({
			...state,
			intelData: [],
			offSet: 0,
			isLoading: true,
		}));

		return InxServices.initializeSearch(dataSearch.search, companyID)
			.then((res: any) => {
				if (res.error == '1')
					throw new Error('An unexpected error has occurred');
				setSearchData((state: SearchResult) => ({
					...state,
					intelID: res.response?.id ?? '',
					count: res.response?.count ?? 0,
					isLoading: false,
				}));
				return res.response.id;
			})
			.catch(() =>
				setSearchData((state: SearchResult) => ({
					...state,
					isLoading: false,
				})),
			);
	};

	const refetchInitial = (companyID: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchInitialSearch(companyID);
	};

	const getData = (): SearchResult => {
		return !dataSearch.isLoading ? dataSearch : emptyState;
	};

	return { getData, setSearchData, refetchInitial };
};
