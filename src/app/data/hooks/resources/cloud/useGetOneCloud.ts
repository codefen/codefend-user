import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import {  genericFetcher } from '@services/swr';
import useSWR from 'swr';

export const useGetOneCloud = () => {
	const { getCompany } = useUserData();

	const swrKeYRef = useRef<any>([
		'resources/cloud',
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
            refreshWhenHidden: false,
            revalidateOnReconnect: false,
			keepPreviousData:false
		},
	);

	const refetch = (id:any) =>
		{
            swrKeYRef.current = ["resources/cloud", { company_id: getCompany(), ac: 'view_one', id: id }];
            mutate(undefined, {
                revalidate: true,
                optimisticData: data,
                populateCache: false,

            });
        }

	const updateCreds = (newCred:any)=>{
		const updatedCreds = data.unico.creds ? [...data.unico.creds, newCred] : [newCred];
		const newData = {...data, unico: {...data.unico, creds: updatedCreds}};
		mutate(newData, {
			revalidate: false,
			populateCache: true,
			optimisticData: newData
		});
	}

	return {
		data: data ? data?.unico : {},
		isLoading: isLoading || isValidating,
		refetch,
		updateCreds
	};
};
