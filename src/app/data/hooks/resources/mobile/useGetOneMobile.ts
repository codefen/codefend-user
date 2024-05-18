import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import {  genericFetcher } from '@services/swr';
import useSWR from 'swr';

export const useGetOneMobile = () => {
	const { getCompany } = useUserData();

	const swrKeYRef = useRef<any>([
		'resources/mobile',
		{ company_id: getCompany(), ac: 'view_one', id: "0" },
	]);

	const { data, mutate, isLoading, isValidating } = useSWR(
		swrKeYRef.current,
		(key: any) => genericFetcher(key),
		{
            fallback: {},

            revalidateOnMount: false,
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,

            refreshWhenHidden: false,
			refreshWhenOffline: false,
			keepPreviousData:false,
		},
	);

	const refetch = (id:any) =>
		{
            swrKeYRef.current = ["resources/mobile", { company_id: getCompany(), ac: 'view_one', id: id }];
            mutate(undefined, {
                revalidate: true,
                optimisticData: data,
                populateCache: false,

            });
        }

	return {
		data: data ? data?.unico : {},
		isLoading: isLoading || isValidating,
		refetch
	};
};
