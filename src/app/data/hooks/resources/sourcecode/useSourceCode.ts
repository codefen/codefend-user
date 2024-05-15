import { useRef } from 'react';
import {
	ResourcesTypes,
	useOrderStore,
} from '../../..';
import { useUserData } from '#commonUserHooks/useUserData';
import { defaultConfig, disponibleFetcher } from '@services/swr';
import useSWR from 'swr';

export const useSourceCode = () => {
	const { updateState, setScopeTotalResources } = useOrderStore(
		(state) => state,
	);
	const { getCompany, logout} = useUserData();
	const swrKeYRef = useRef<any>([["resources/source", "view_all"], {company: getCompany(), logout}]);
	const { data, mutate, isLoading,isValidating } = useSWR(
		swrKeYRef.current,
		(key:any)=> disponibleFetcher(key),
		{
			...defaultConfig,
			onSuccess: ()=>{
				setScopeTotalResources(data.length);
				updateState("resourceType", ResourcesTypes.CODE);
			},
		}
	);

	return {
		data: data ? data : [],
		isLoading: isLoading || isValidating,
		refetch: ()=> mutate(undefined, {
			revalidate: true,
			optimisticData: data,
		}),
	};
};
