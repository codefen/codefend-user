import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';

export const useIntelPreview = () => {
	const [fetcher, _, isLoading] = useFetcher();
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
		})
			.then(({ data }: any) => {
				data = JSON.parse(String(data).trim());
				if (!data.preview) return;
				

				const intelPreviewData = intelPreview.current;
				intelPreviewData.push({
					id: params.sid,
					preview: data.preview,
				});
				setIntelPreview(intelPreviewData);
				return true;
			});
	};

	const refetchPreview = (params: any, companyID: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		return fetchPreview(params, companyID);
	};

	return {
		intelPreview: intelPreview.current,
		isLoadingPreview: isLoading,
		setIntelPreview,
		refetchPreview,
	};
};
