import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { EMPTY_TICKET_WITHCHILD } from '@mocks/empty';

const fetcher = (id: string) =>
	AxiosHttpService.getInstance()
		.post<any>({
			body: {
				model: 'cs/index',
				ac: 'view_one',
				company_id: id.split('-')[0],
				id: id.split('-')[1],
			},
		})
		.then(({ data }) =>
			data.error == '1'
				? EMPTY_TICKET_WITHCHILD
				: {
						...data.unico,
						childs: data.unico?.childs ? data.unico?.childs : [],
				  },
		);

export const useSWRMessage = (ticketID: string,companyID: string) => {
	const { data, mutate, isLoading } = useSWR(
		`${companyID}-${ticketID}-cs`,
		fetcher,
        {
            keepPreviousData: true,
            revalidateOnReconnect: true,
            refreshInterval: 3000,
            refreshWhenHidden: true,
            revalidateOnFocus: true,
            revalidateOnMount: true
        }
	);

	return { data, mutate, isLoading };
};
