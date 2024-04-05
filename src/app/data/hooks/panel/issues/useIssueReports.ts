import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuthState, baseUrl, getCustomBaseAPi, getToken, mapIssueShareV2, mapMobileApp, mapWebresourceApiToWebresource, mapCloudApp, mapReportIssues} from "../../..";
import { useReportStore } from "../../../";
import { handleFetchError } from "@services/api.utils";

export const useIssueReport = ()=>{
    const resources = useRef<any>(null);
	const issues = useRef<any>(null);
	const share = useRef<any>(null);
	const [resourceDomainText, setDomainText] = useState('');
    
    const { getCompany } = useAuthState();
    const {resourceID, resourceType} = useReportStore((state)=>state);

  const abortController = new AbortController();
  const fetcher = (companyID: string, issueID: string, resourceType: string, token:string) => {
    const url = getCustomBaseAPi() ? getCustomBaseAPi() : baseUrl;
    const bodyParams = new FormData();

    bodyParams.append("model", 'issues/inform');
    bodyParams.append("company_id", companyID);
    bodyParams.append("resource_id", issueID);
    bodyParams.append("resource_class", resourceType);
    bodyParams.append("session", token);

    return fetch(url, {
        method: 'POST',
        body: bodyParams,
        headers: {
            'Accept': 'application/json'
        },
        signal: abortController.signal
    })
    .then(response => {
        if (!response.ok)  throw new Error('Network response was not ok');
        return response.json();
    })
    .then(response => {

        issues.current = response.issues ? response.issues.map((issue: any) => mapReportIssues(issue)) : [];

		share.current = mapIssueShareV2(response);
        
		if (resourceType === 'web') {
			resources.current = [
				mapWebresourceApiToWebresource(response.resource),
			];
		} else if (resourceType === 'mobile') {
			resources.current = mapMobileApp(response.resource);
		} else if (resourceType === 'cloud') {
			resources.current = mapCloudApp(response.resource);
		}

		if (resources.current) {
			if (resourceType === 'web') {
				setDomainText(resources.current[0].resourceDomain);
			} else if (
				resourceType === 'mobile' ||
				resourceType === 'cloud'
			) {
			    setDomainText(resources.current.appName);
			}
	    }
                    
        return response;
    })
    .catch(error => {
        handleFetchError(error.message);
    });
}

    const fetchReport = ()=>{
      const companyID = getCompany();
      if (!companyID) {
        toast.error('User information was not found');
        return Promise.resolve(false);
      }
      let token = getToken();

        return fetcher(companyID, resourceID, resourceType, token);
    }


    return { fetchReport, resourceDomainText, resources: resources.current, issues: issues.current, share: share.current, abort: abortController };
}