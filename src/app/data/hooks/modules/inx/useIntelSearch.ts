import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { mapIntelData } from '@utils/mapper';

export const useIntelSearch = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const intelData = useRef<any[]>([]);
	const setIntelData = (updatedIntelData: any) => {
		intelData.current = updatedIntelData;
	};

	const refetchIntelData = async (
		id: string,
		offset: number,
		companyID: string,
	) => {
		if(id === "00000000-0000-0000-0000-000000000000"){
			toast.error("No results found for the search");
			return Promise.reject({ intelLen: 0, intelResult: [] });
		}
		return fetcher('post', {
			body: {
				model: 'modules/inx',
				ac: 'search',
				company_id: companyID,
				id: id,
				offset: offset,
			},
		}).then(({ data }: any) => {
				if(typeof data === "string") data = JSON.parse(String(data).trim());

				if (data?.error == '1') {
					throw new Error('An unexpected error has occurred');
				}

				const intelResult = data.records ? data.records.map((intel: any) =>
					mapIntelData(intel),
				) : [];

				const intelProc = intelData.current.concat(intelResult);
				intelData.current = intelProc;
				return { intelLen: intelResult.length, intelResult };
			})
			.catch((error: Error) => {
				toast.error(error.message);
				return { intelLen: 0, intelResult: [] };
			});
	};

	return { intelData: intelData.current, setIntelData, refetchIntelData };
};
