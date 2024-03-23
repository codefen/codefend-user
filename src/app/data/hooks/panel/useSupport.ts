import {
	CustomerSupportService,
	type FetchPattern,
	type SupportProps,
	type TicketUnique,
	mapSupportProps,
	mapTicketUnique,
} from '../../';
import { useAuthState } from '..';
import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';

/* Custom Hook "useAllTicket" to retrieve all tickets in customer support view*/
export const useAllTicket = () => {
	const { getCompany } = useAuthState();
	const [{ data, error, isLoading }, dispatch] = useState({
		data: null,
		error: null,
		isLoading: true,
	});

	const fetchAll = async (companyID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return CustomerSupportService.getAll(companyID)
			.then((data) =>
				dispatch({
					data: data.disponibles
						.map((dis: any) => mapSupportProps(dis))
						.reverse(),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = () => {
		const companyID = getCompany();
		if (!companyID) {
			console.error("Error: 'companyID' no está definido en userData.");
			toast.error('User information was not found');
			return;
		}
		fetchAll(companyID);
		if (error) console.log({ error });
	};
	const getTikets = (): SupportProps[] => {
		const ticket = isLoading ? ([] as SupportProps[]) : data;
		return ticket?.reverse() ?? [];
	};

	return {
		getTikets,
		isLoading,
		refetch,
	};
};

/* Custom hook "useOneTicket" to retrieve a single ticket*/
export const useOneTicket = () => {
	const { getUserdata, getCompany } = useAuthState();
	const [{ data, isLoading }, dispatch] = useState<FetchPattern<TicketUnique>>(
		{
			data: null,
			error: null,
			isLoading: true,
		},
	);

	const fetchOne = async (companyID: string, ticketID: string) => {
		dispatch((state) => ({ ...state, isLoading: true }));
		return CustomerSupportService.getOne(ticketID, companyID)
			.then((response) =>
				dispatch({
					data: mapTicketUnique(response),
					error: null,
					isLoading: false,
				}),
			)
			.catch((error) => dispatch({ data: null, error, isLoading: false }));
	};

	const refetch = (ticketID: string) => {
		const companyID = getCompany();
		if (!companyID) {
			console.error("Error: 'companyID' is not defined in userData.");
			toast.error('User information was not found');
			return;
		}
		fetchOne(companyID, ticketID);
	};
	const getOneTicket = (): TicketUnique => {
		return isLoading ? ({} as TicketUnique) : data ?? ({} as TicketUnique);
	};

	return {
		getOneTicket,
		refetch,
		isLoading,
	};
};

/* Custom Hook "useAddTicket" to add a new ticket*/
export const useAddTicket = () => {
	const [title, setTitle] = useState('');
	const [shortDescription, setShortDescription] = useState('');
	const [isAddingTicket, setIsAddingTicket] = useState(false);
	const { getUserdata, getCompany } = useAuthState();

	const fetchAdd = async (params: any, userID: string, companyID: string) => {
		setIsAddingTicket(true);
		return CustomerSupportService.add(params, userID, companyID)
			.then(() => {
				toast.success('Successfully Added Ticket...');
			})
			.finally(() => {
				setIsAddingTicket(false);
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

	return { title, isAddingTicket, setShortDescription, setTitle, addTicket };
};

/* Custom Hook "useTicketDelete" to handle the "deletion" of a ticket*/
export const useTicketDelete = () => {
	const { getUserdata, getCompany } = useAuthState();
	const fetchDelete = useCallback(
		async (ticketID: string, companyID: string) => {
			return CustomerSupportService.delete(ticketID, companyID);
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
