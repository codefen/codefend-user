import { useCallback, useState } from 'react';
import { useAuthState } from '..';
import { FetchPattern, SocialAplicationService, MemberV2 } from '../../../data';
import { toast } from 'react-toastify';

export const useSocial = () => {
	const { getUserdata } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<MemberV2[]>
	>({
		data: null,
		error: null,
		isLoading: true,
	});

	const fetchSocial = async (companyID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return SocialAplicationService.getAll(companyID)
			.then((response: any) => {
				dispatch({
					data: response.disponibles,
					error: null,
					isLoading: false,
				});
			})
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = useCallback(() => {
		const companyID = getUserdata()?.companyID as string;
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchSocial(companyID);
	}, [getUserdata]);
	return { members: data, loading: isLoading, error, refetch };
};
