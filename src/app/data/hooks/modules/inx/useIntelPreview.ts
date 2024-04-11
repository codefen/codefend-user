import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useIntelPreview = () => {
	const [fetcher, cancelRequest, isLoading] = useFetcher();
	const intelPreview = useRef<any[]>([]);
	const setIntelPreview = (updated: any) => {
		intelPreview.current = updated;
	};

	const fetchPreview = async (params: any, companyID: string) => {
		return fetcher('post', {
			body: {
				model: 'modules/inx',
				ac: 'preview',
				company_id: companyID,
				...params,
			},
			requestId: `p-${params.sid}-${params.bid}`
		})
			.then(({ data }: any) => {
				if (!data || data.trim() === "") return false;	

				const intelPreviewData = intelPreview.current;
				intelPreviewData.push({
					id: params.sid,
					preview: data,
				});
				setIntelPreview(intelPreviewData);
				return true;
			});
	};

	const refetchPreview = (params: any, companyID: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}
		return fetchPreview(params, companyID);
	};

	return {
		intelPreview: intelPreview.current,
		isLoadingPreview: isLoading,
		setIntelPreview,
		refetchPreview,
		cancelRequest
	};
};
