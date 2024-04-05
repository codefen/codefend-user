import { handleFetchError } from '@services/api.utils';
import { getCustomBaseAPi, baseUrl, getToken } from '../../..';
import { useRef, useState } from 'react';

export const useInxReadFile = () => {
	const [fullDataLoading, setFullDataLoading] = useState<boolean>(false);

	const selectedResult = useRef<any>(null);
	const fileName = useRef<string>("");
	const fileType = useRef<string>("");
	const setSelectedResult = (updated:any)=>{
		selectedResult.current = updated;
	}
	const readFile = (intel: any, companyID: string) => {
		setFullDataLoading(true);
		const url = getCustomBaseAPi() ? getCustomBaseAPi() : baseUrl;
		let token = getToken();
		const bodyParams = new FormData();
		bodyParams.append("model", 'modules/inx');
		bodyParams.append("ac", 'read');
		bodyParams.append("company_id", companyID);
		bodyParams.append("sid", intel.storage_id);
		bodyParams.append("bid", intel.bucket_id);
		bodyParams.append("session", token);

		fetch(url, {
			method: "POST",
			body: bodyParams,
			headers: {
				'Accept': 'application/json'
			}
		}).then( (response) => {
			if (!response.ok)  throw new Error('Network response was not ok');
			return response.text();
		}).then((res: any) => {
			selectedResult.current = JSON.parse(String(res).trim()).response;
			fileName.current = intel.name;
			fileType.current = intel.bucket_data;
		})
		.catch((error) => 
			handleFetchError(error.message)
		)
		.finally(()=>setFullDataLoading(false));
	};

	return { fullDataLoading, selectedResult, fileName, fileType, setSelectedResult, readFile };
};
