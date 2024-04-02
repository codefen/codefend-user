import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

interface SearchResult {
	intelID: string;
	count: number;
	offSet: number;
	search: string;
}

export const useInitialSearch = () => {
	const emptyState = {
		count: 0,
		offSet: 0,
		intelID: '',
		search: '',
	};
	const [fetcher, _, isLoading] = useFetcher();
	const intelData = useRef([]);
	const [dataSearch, setSearchData] = useState<SearchResult>(emptyState);

	const fetchInitialSearch = async (companyID: string, term: string) => {
		setSearchData((state: SearchResult) => ({
			...state,
			offSet: 0,
			search: term,
		}));
		fetcher("post", {
			body: {
				model: 'modules/inx',
				ac: 'init_search',
				term: term,
				company_id: companyID,
			},
			insecure: true
		}).then(({ data }: any) => {
				data = JSON.parse(String(data).trim());

				if (data.error == '1') throw new Error('An unexpected error has occurred');

				setSearchData((state: SearchResult) => ({
					...state,
					intelID: data.response.id || '',
					count: data.response.count || 0,
				}));
				return data.response.id;
			})
			.catch((e: Error) =>
				{
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

	return { getData, setSearchData, refetchInitial, intelData, isLoading };
};
