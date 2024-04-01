import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { mapIntelData } from '@utils/mapper';

export const useIntelSearch = () => {
	const [fetcher, _, isLoading] = useFetcher();
	const intelData = useRef<any>([]);
	const setIntelData = (updatedIntelData: any) => {
		intelData.current = updatedIntelData;
	};

	const refetchIntelData = async (
		id: string,
		offset: number,
		companyID: string,
	) => {
		fetcher('post', {
			body: {
				model: 'modules/inx',
				ac: 'search',
				company_id: companyID,
				id: id,
				offset: offset,
			},
		}).then(({ data }: any) => {
				data = JSON.parse(String(data).trim());

				if (data.error == '1') {
					throw new Error('An unexpected error has occurred');
				}

				const intelResult = data.response.map((intel: any) =>
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
