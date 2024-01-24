import { InxServices } from '../../';
import { useState } from 'react';

export interface IntelSelected {
	intelSelected: any;
	fileName: string;
	fileType: string;
}

export const useIntelReadFile = () => {
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
			.then((res: any) => {
				if (res.intel) {
					setSelectedResult({
						intelSelected: res.intel as any,
						fileName: intel.name as string,
						fileType: intel.bucket_data as string,
					});
				}
			})
			.finally(() => setFullDataLoading(false));
	};

	return { fullDataLoading, selectedResult, setSelectedResult, readFile };
};
