import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import {
	apiErrorValidation,
	companyIdIsNull,
} from '@/app/constants/validations';
import type { FullOrder } from '@interfaces/order';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export const useProviderOrderFinished = () => {
	const { getCompany } = useUserData();
	const [fetcher, _, isLoading] = useFetcher();
	const finishedOrders = useRef<FullOrder[]>([]);

	const getFinishedOrders = () => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		return fetcher('post', {
			body: {
				model: 'providers/orders/index/finished',
				company_id: getCompany(),
			},
		})
			.then(({ data }: any) => {
				if (
					data.isAnError ||
					apiErrorValidation(data?.error, data?.response)
				) {
					throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
				}
				finishedOrders.current = data.orders ? data.orders : [];
			})
			.catch((e: Error) => toast.error(e.message));
	};

	return [finishedOrders, { getFinishedOrders, isLoading }] as const;
};
