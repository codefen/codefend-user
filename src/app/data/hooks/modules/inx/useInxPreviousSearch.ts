import { useRef } from 'react';
import { toast } from 'react-toastify';
import {
	type PreviusSearch,
	mapPreviusSearch,
	verifySession,
} from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';

export interface PreviousSearch {
	id: string;
	company_id: string;
	user_id: string;
	username: string;
	model: string;
	info: string;
	address_ra: string;
	address_hci: string;
	address_hxff: string;
	user_pais: string;
	user_pais_code: string;
	user_pais_provincia: string;
	user_pais_ciudad: string;
	user_ua: string;
	condicion: string;
	eliminado: string;
	creacion: string;
}

export const useInxPreviousSearch = () => {
	const { getCompany, logout } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const dataRef = useRef<PreviousSearch[]>([]);

	const fetchInitialSearch = async (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'modules/inx',
				ac: 'view_previous',
				company_id: companyID,
			},
		})
			.then(({ data }: any) => {
				data = JSON.parse(String(data).trim());
				if(verifySession(data, logout)) return;

				if (data.response !== 'success')
					throw new Error(
						data.info || 'An unexpected error has occurred',
					);
				dataRef.current = data.previous_searches ? data.previous_searches.map(
					(searches: any) => mapPreviusSearch(searches) as PreviusSearch,
				) : [];
			})
			.catch((e: Error) => toast.error(e.message));
	};

	const refetch = () => {
		if (!getCompany()) {
			toast.error('User information was not found');
			return;
		}
		fetchInitialSearch(getCompany());
	};

	const getData = (): PreviousSearch[] => {
		return !isLoading ? dataRef.current : [];
	};

	return { previousSearches: getData(), isLoading, refetch };
};
