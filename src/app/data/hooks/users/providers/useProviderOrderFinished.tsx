import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import type { FullOrder } from '@interfaces/order';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export const useProviderOrderFinished = () => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const finishedOrders = useRef<FullOrder[]>([]);

	const getFinishedOrders = () => {
		const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetcher('post', {
			body: {
				model: 'providers/orders/index/finished',
				company_id: getCompany(),
			},
		})
			.then(({ data }: any) => {
				if (data.error != '0') throw new Error();
				finishedOrders.current = data.orders ? data.orders : [];
			})
			.catch((err: any) => {
				toast.error(
					'An unexpected error has occurred, when rejecting the order try again later',
				);
			});
	};

	return [finishedOrders, { getFinishedOrders, isLoading }] as const;
};
