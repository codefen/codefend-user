import { useState } from 'react';
import { InxServices, mapIntelData } from '../../../';
import { toast } from 'react-toastify';

export const useIntelSearch = () => {
	const [intelData, setIntelData] = useState<any[]>([]);

	const refetchIntelData = async (
		id: string,
		offset: number,
		companyID: string,
	) => {
		return InxServices.search({ id, offset }, companyID)
			.then((res: any) => {
				if (res.error == '1') {
					throw new Error('An unexpected error has occurred');
				}
				const intelResult = res.response.map((intel: any) =>
					mapIntelData(intel),
				) as any[];

				const intelProc = intelData.concat(intelResult);
				
				setIntelData(intelProc);

				console.log({intelProc});

				return { intelLen: intelProc.length, intelResult };
			})
			.catch((error: Error) => toast.error(error.message));
	};

	return { intelData, setIntelData, refetchIntelData };
};
