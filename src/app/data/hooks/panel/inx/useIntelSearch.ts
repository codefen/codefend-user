import { useRef, useState } from 'react';
import { InxServices, mapIntelData } from '../../../';
import { toast } from 'react-toastify';

export const useIntelSearch = () => {
	//const [intelData, setIntelData] = useState<any[]>([]);
	const intelData = useRef<any>([]);
	const setIntelData = (updatedIntelData: any)=>{
		intelData.current = updatedIntelData;
	}

	const refetchIntelData = async (
		id: string,
		offset: number,
		companyID: string,
	) => {
		return InxServices.search({ id, offset }, companyID)
			.then((res: any) => {
				res = JSON.parse(String(res).trim());
				
				if (res.error == '1') {
					throw new Error('An unexpected error has occurred');
				}

				const intelResult = res.response.map((intel: any) =>
					mapIntelData(intel),
				);

				const intelProc = intelData.current.concat(intelResult);
				intelData.current = intelProc;
				return { intelLen: intelResult.length, intelResult };
			})
			.catch((error: Error) => toast.error(error.message));
	};



	return { intelData: intelData.current, setIntelData, refetchIntelData };
};
