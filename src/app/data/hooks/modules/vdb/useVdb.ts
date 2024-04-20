import { toast } from 'react-toastify';
import {
	type ResultsVdbSearchV2,
	mapVdbResultV2,
} from '../../..';
import { type ChangeEvent, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

/* Custom Hook "useInitialVdb" to handle the search result in vdb */
export const useInitialVdb = () => {
	const { getCompany } = useUserData();
	const { search } = useParams();
	const [searchData, setSearchData] = useState('');
	const vdbResults = useRef<ResultsVdbSearchV2[]>([]);
	const [fetcher, cancelRequest, isLoading] = useFetcher();

	const fetchInitialVdb = async (companyID: string, search: string) => {
		return fetcher('post', {
			body: {
				model: 'modules/vdb_new',
				ac: 'search',
				company_id: companyID,
				keyword: search,
			},
			insecure: true
		}).then(({ data }: any) => {
			vdbResults.current = Array.isArray(data)
				? data.map((result: any) => mapVdbResultV2(result))
				: [];
			if(!Boolean(vdbResults.current.length)){
				toast.success("No search results found");
			}
		});
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
