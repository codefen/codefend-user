import { useState } from 'react';
import { toast } from 'react-toastify';
import {
	FetchPattern,
	InxServices,
	PreviusSearch,
	mapPreviusSearch,
	useAuthState,
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
	const { getCompany } = useAuthState();
	const companyId = getCompany();

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
			.then((response: any) => {
				if (response.response !== 'success')
					throw new Error(
						response.message ?? 'An unexpected error has occurred',
					);

				dispatch({
					data: response.previous_searches.map(
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
		if (!companyId) {
			toast.error('User information was not found');
			return;
		}
		fetchInitialSearch(companyId);
	};

	const getData = (): PreviousSearch[] => {
		const _data = !isLoading ? data : [];
		return _data ?? ([] as PreviousSearch[]);
	};

	return { previousSearches: getData(), isLoading, refetch };
};
