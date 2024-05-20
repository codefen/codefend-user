import {  useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { processScans } from '@utils/helper.ts';
import { toast } from 'react-toastify';
import { useUserData } from '#commonUserHooks/useUserData';
import { companyIdIsNull } from '@/app/constants/validations';

export const useEnpGetScans  =()=>{
    const { getCompany } = useUserData();
    const [fetcher,_, isLoading] = useFetcher();
	const dataRef = useRef<any[]>([]);
	const [scansFiltered, setScansFiltered] = useState<any[]>([]);



    const fetchEnd = async (companyID: string) => {
		fetcher('post', {
			body: {
				model: 'modules/epm/devices',
                ac: 'get_scans',
                company_id: companyID,
			},
		}).then(({ data }: any) => {
			dataRef.current = data.data;

			if (data?.data?.length) {
				setScansFiltered(processScans(data.data));
			}
		});
	};

	const refetch = async () => {
		const companyID = getCompany();
		if (companyIdIsNull(companyID)) return;
		fetchEnd(companyID);
	};

    return {refetch, scans: dataRef.current, scansFiltered} as const;
}