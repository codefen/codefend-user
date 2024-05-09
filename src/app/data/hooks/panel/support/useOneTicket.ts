import {
	type Ticket,
	type TicketWithChild,
} from '@interfaces/panel.ts';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useRef } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { EMPTY_TICKET_WITHCHILD } from '@mocks/empty';

/* Custom hook "useOneTicket" to retrieve a single ticket*/
export const useOneTicket = () => {
	const { getCompany } = useUserData();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<TicketWithChild>(EMPTY_TICKET_WITHCHILD);

	const fetchOne = async (companyID: string, ticketID: string) => {
		return fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'view_one',
				company_id: companyID,
				id: ticketID,
			},
		}).then(({ data }: any) => {
			if(data.error == "1"){
				dataRef.current = EMPTY_TICKET_WITHCHILD;
				throw new Error("");
			} else {
				dataRef.current = {...data.unico, childs: data.unico?.childs ? data.unico?.childs : []};
			}
			
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

	return {
		ticket: dataRef.current,
		refetch,
		isLoading,
	};
};