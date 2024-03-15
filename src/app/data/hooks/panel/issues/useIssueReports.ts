import { toast } from "react-toastify";
import { useAuthState, baseUrl, getCustomBaseAPi, getToken, handleFetchError, mapWebresourceApiToWebresource, mapReportIssues, mapIssueShare } from "../../..";
import { IssueService, mapWebReportResources, useReportInfoStore, useReportStore } from "../../../";

export const useIssueReport = ()=>{
    let token = getToken();
    const customAPi = getCustomBaseAPi();
    const _baseUrl = customAPi ? customAPi : baseUrl;
    const { getCompany } = useAuthState();
    const {resourceID, resourceType} = useReportStore((state)=>state);
	const {
		setResources,
		setIssues,
		setIssueShare,
        setIsLoading,
	} = useReportInfoStore((state) => state);
    
    const fetcher = (companyID: string, issueID: string, resourceType:string)=>{
        setIsLoading(true);

        const xhr = new XMLHttpRequest();
        const url = _baseUrl;
        const bodyParams = new FormData();
        
        bodyParams.append("model", 'issues/inform');
        bodyParams.append("company_id", companyID);
        bodyParams.append("resource_id", issueID);
        bodyParams.append("resource_class", resourceType);
        bodyParams.append("session", token);
        
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Accept", "application/json");

        xhr.onreadystatechange =  ()=> {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);

              if (resourceType === "web") {
                if (response) {
                  localStorage.setItem("report-resource", JSON.stringify([mapWebresourceApiToWebresource(response.resource)]));
                   localStorage.setItem("report-issues", JSON.stringify(response.issues.map((issue:any)=>mapReportIssues(issue))));
                    localStorage.setItem("report-share", JSON.stringify(mapIssueShare(response)));
                }
              }
            }
            setIsLoading(false);
          };
          
          xhr.onerror =  ()=> {
            handleFetchError(xhr.statusText);
            setIsLoading(false);
          };
          
          xhr.send(bodyParams);
    }

    const fetchReport = ()=>{
      const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
		}

        fetcher(companyID, resourceID, resourceType);
    }


    return { fetchReport };
}