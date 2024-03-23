import { useCallback, useState } from 'react';
import { useAuthState } from '..';
import { type FetchPattern, SocialAplicationService, type MemberV2, verifySession, useOrderStore, ResourcesTypes } from '../../../data';
import { toast } from 'react-toastify';

/* Custom Hook "useSocial" to handle GET data in Social page*/
export const useSocial = () => {
	const { getUserdata, getCompany, logout } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState<
		FetchPattern<MemberV2[]>
	>({
		data: null,
		error: null,
		isLoading: true,
	});
	const { updateState,setScopeTotalResources } = useOrderStore((state) => state);
	
	const fetchSocial = async (companyID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return SocialAplicationService.getAll(companyID)
			.then((response: any) => {
				verifySession(response, logout);

				dispatch({
					data: response.disponibles,
					error: null,
					isLoading: false,
				});
				setScopeTotalResources(response.disponibles.length);
			})
			.catch((error) => dispatch({ data: null, error, isLoading: false })).finally(()=> updateState("resourceType", ResourcesTypes.SOCIAL));
	};

	const refetch = useCallback(() => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchSocial(companyID);
	}, [getUserdata]);
	return { members: data, loading: isLoading, error, refetch };
};
