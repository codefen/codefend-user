import { InxServices } from '../../../';
import { useState } from 'react';

export interface IntelSelected {
	intelSelected: any;
	fileName: string;
	fileType: string;
}

export const useInxReadFile = () => {
	const [fullDataLoading, setFullDataLoading] = useState<boolean>(false);
	const [selectedResult, setSelectedResult] = useState<IntelSelected | null>(
		null,
	);

	const readFile = (intel: any, companyID: string) => {
		setFullDataLoading(true);
		const params = {
			sid: intel.storage_id,
			bid: intel.bucket_id,
		};
		InxServices.read(params, companyID)
			.then((res) => {
				res = JSON.parse(String(res).trim());
				const response = res.response;
				setFullDataLoading(false);

				setSelectedResult({
					intelSelected: response,
					fileName: intel.name as string,
					fileType: intel.bucket_data as string,
				});
			});
	};

	return { fullDataLoading, selectedResult, setSelectedResult, readFile };
};
