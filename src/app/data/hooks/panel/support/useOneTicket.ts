import {
	type TicketWithChild,
} from '@interfaces/panel.ts';
import { useAuthState } from '../..';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';

/* Custom hook "useOneTicket" to retrieve a single ticket*/
export const useOneTicket = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<TicketWithChild>();

	const fetchOne = async (companyID: string, ticketID: string) => {
		return fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'view_one',
				company_id: companyID,
				id: ticketID,
			},
		}).then(({ data }: any) => {
			dataRef.current = data.unico;
		});
	};

	const refetch = (ticketID: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchOne(companyID, ticketID);
	};
	const getOneTicket = (): TicketWithChild | undefined => {
		return isLoading
			? undefined
			: dataRef.current;
	};

	return {
		getOneTicket,
		refetch,
		isLoading,
	};
};