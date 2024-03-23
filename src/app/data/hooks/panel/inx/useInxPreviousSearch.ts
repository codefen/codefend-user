import { useState } from 'react';
import { toast } from 'react-toastify';
import {
	type FetchPattern,
	InxServices,
	type PreviusSearch,
	mapPreviusSearch,
	useAuthState,
	verifySession,
} from '../../../';

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
	const { getCompany, logout } = useAuthState();

	const [{ data, isLoading }, dispatch] = useState<
		FetchPattern<PreviousSearch[]>
	>({
		data: null,
		error: null,
		isLoading: true,
	});

	const fetchInitialSearch = async (companyID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));

		return InxServices.getPreviousSearches(companyID)
			.then((res: any) => {
				res = JSON.parse(String(res).trim());
				verifySession(res, logout);

				if (res.response !== 'success')
					throw new Error(
						res.message ?? 'An unexpected error has occurred',
					);

				dispatch({
					data: res.previous_searches.map(
						(searches: any) =>
							mapPreviusSearch(searches) as PreviusSearch,
					),
					error: null,
					isLoading: false,
				});
			})
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = () => {
		if (!getCompany()) {
			toast.error('User information was not found');
			return;
		}
		fetchInitialSearch(getCompany());
	};

	const getData = (): PreviousSearch[] => {
		const _data = !isLoading ? data : [];
		return _data ?? ([] as PreviousSearch[]);
	};

	return { previousSearches: getData(), isLoading, refetch };
};
