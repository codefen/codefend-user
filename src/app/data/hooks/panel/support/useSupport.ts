import {
	type SupportProps,
	type TicketUnique,
	mapTicketUnique,
} from '../../..';
import { useAuthState } from '../..';
import { toast } from 'react-toastify';
import { useCallback, useRef, useState } from 'react';
import { useFetcher } from '../../util/useFetcher';

/* Custom Hook "useAllTicket" to retrieve all tickets in customer support view*/
export const useAllTicket = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<SupportProps[]>([]);

	const fetchAll = async (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'view_all',
				company_id: companyID,
			},
		}).then(({ data }: any) => {
			dataRef.current = data.disponibles || [];
		});
	};

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			console.error("Error: 'companyID' no está definido en userData.");
			toast.error('User information was not found');
			return;
		}
		fetchAll(companyID);
	};
	const getTikets = (): SupportProps[] => {
		const ticket = isLoading ? ([] as SupportProps[]) : dataRef.current;
		return ticket.reverse() || [];
	};

	return {
		getTikets,
		isLoading,
		refetch,
	};
};

/* Custom hook "useOneTicket" to retrieve a single ticket*/
export const useOneTicket = () => {
	const { getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<TicketUnique>();

	const fetchOne = async (companyID: string, ticketID: string) => {
		return fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'view_one',
				company_id: companyID,
				id: ticketID,
			},
		}).then(({ data }: any) => {
			dataRef.current = mapTicketUnique(data);
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
	const getOneTicket = (): TicketUnique => {
		return isLoading
			? ({} as TicketUnique)
			: dataRef.current || ({} as TicketUnique);
	};

	return {
		getOneTicket,
		refetch,
		isLoading,
	};
};

/* Custom Hook "useAddTicket" to add a new ticket*/
export const useAddTicket = () => {
	const [fetcher,_, isLoading] = useFetcher();
	const [title, setTitle] = useState('');
	const [shortDescription, setShortDescription] = useState('');
	const { getUserdata, getCompany } = useAuthState();

	const fetchAdd = async (params: any, userID: string, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'cs/index',
				ac: 'add',
				user_id: userID,
				company_id: companyID,
				...params,
			},
		}).then(({data}:any) => {
			console.log({ data });
			toast.success('Successfully Added Ticket...');
		});
	};

	const addTicket = (): any => {
		const companyID = getCompany();
		const userID = getUserdata()?.id;
		if (!companyID || !userID) {
			toast.error('User information was not found');
			return;
		}
		if (!title.trim()) {
			toast.error('Invalid ticket title');
			return;
		}
		if (!shortDescription.trim()) {
			toast.error('Invalid short description');
			return;
		}
		const params = {
			condicion: 'open',
			cs_header: title,
			cs_body: shortDescription,
		};
		return fetchAdd(params, userID, companyID);
	};

	return { title, isAddingTicket: isLoading, setShortDescription, setTitle, addTicket };
};

/* Custom Hook "useTicketDelete" to handle the "deletion" of a ticket*/
export const useTicketDelete = () => {
	const {getCompany } = useAuthState();
	const [fetcher,_, isLoading] = useFetcher();
	const fetchDelete = useCallback(
		async (ticketID: string, companyID: string) => {
			return fetcher("post", {
				body: {
					model: 'cs/index',
					ac: 'del',
					id: ticketID,
					company_id: companyID,
				}
			}).then(({ data }:any)=> data);
		},
		[],
	);

	const deletTicket = (ticketID: string) => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchDelete(ticketID, companyID);
	};

	return { deletTicket };
};
