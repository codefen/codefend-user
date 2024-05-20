import { useRef } from 'react';
import { toast } from 'react-toastify';
import {
	type PreviusSearch,
	mapPreviusSearch,
} from '../../..';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

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

				if (apiErrorValidation(data?.error, data?.response)){
					throw new Error(
						data.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR
					);
				}
				
				dataRef.current = data.previous_searches ? data.previous_searches.map(
					(searches: any) => mapPreviusSearch(searches) as PreviusSearch,
				) : [];
			})
			.catch((e: Error) => toast.error(e.message));
	};

	const refetch = () => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		fetchInitialSearch(companyID);
	};

	const getData = (): PreviousSearch[] => {
		return !isLoading ? dataRef.current : [];
	};

	return { previousSearches: getData(), isLoading, refetch };
};
