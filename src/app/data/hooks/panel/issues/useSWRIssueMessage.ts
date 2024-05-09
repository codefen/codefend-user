import useSWR from 'swr';
import { AxiosHttpService } from '@services/axiosHTTP.service';
import { EMPTY_ISSUE_TICKET } from '@mocks/empty';

const fetcher = (id: string) =>
	AxiosHttpService.getInstance()
		.post<any>({
			body: {
				model: 'issues/cs',
				ac: 'view_one',
				company_id: id.split('-')[0],
				id: id.split('-')[1],
			},
		})
		.then(({ data }) =>
			data.error == '1'
				? []
				: data?.issues_cs ? data.issues_cs : []
		);

export const useSWRIssueMessage = (ticketID: string,companyID: string) => {
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
