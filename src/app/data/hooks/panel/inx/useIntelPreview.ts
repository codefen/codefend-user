import { useState } from 'react';
import { InxServices } from '../../../';
import { toast } from 'react-toastify';

export const useIntelPreview = () => {
	const [intelPreview, setIntelPreview] = useState<any[]>([]);

	const fetchPreview = async (params: any, companyID: string) => {
		return InxServices.preview(params, companyID).then((res) => {
			if (!res.preview) return;

			const intelPreviewData = intelPreview;
			intelPreviewData.push({
				id: params.storage_id,
				preview: res.preview,
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

	return { intelPreview, setIntelPreview, refetchPreview };
};
