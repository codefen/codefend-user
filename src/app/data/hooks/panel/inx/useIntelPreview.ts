import { useState } from 'react';
import { InxServices } from '../../../';
import { toast } from 'react-toastify';

export const useIntelPreview = () => {
	const [intelPreview, setIntelPreview] = useState<any[]>([]);
	const [isLoadingPreview, setPreviewLoading] = useState(false);

	const fetchPreview = async (params: any, companyID: string) => {
		return InxServices.preview(params, companyID).then((res) => {
			if (!res.preview) return;

			const intelPreviewData = intelPreview;
			intelPreviewData.push({
				id: params.sid,
				preview: res.preview,
			});
			setIntelPreview(intelPreviewData);
			return true;
		}).finally(()=> setPreviewLoading(false));
	};

	const refetchPreview = (params: any, companyID: string) => {
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

		setPreviewLoading(true);
		return fetchPreview(params, companyID);
	};

	return { intelPreview, isLoadingPreview, setIntelPreview, refetchPreview };
};
