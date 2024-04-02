import {  useRef, useState } from 'react';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useAuthState } from '#commonHooks/useAuthState.ts';
import { processScans } from '@utils/helper.ts';
import { toast } from 'react-toastify';

export const useEnpGetScans  =()=>{
    const { getCompany } = useAuthState();
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
            console.log({ data });
			dataRef.current = data.data;

			if (data?.data?.length) {
				setScansFiltered(processScans(data.data));
			}
		});
	};

	const refetch = async () => {
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}
		fetchEnd(companyID);
	};

    return {refetch, scans: dataRef.current, scansFiltered} as const;
}