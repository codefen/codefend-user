import { toast } from "react-toastify";
import { useAuthState, baseUrl, getCustomBaseAPi, getToken, handleFetchError} from "../../..";
import { useReportStore } from "../../../";

export const useIssueReport = ()=>{
    let token = getToken();
    const customAPi = getCustomBaseAPi();
    const _baseUrl = customAPi ? customAPi : baseUrl;
    const { getCompany } = useAuthState();
    const {resourceID, resourceType} = useReportStore((state)=>state);

  const abortController = new AbortController();
  const fetcher = (companyID: string, issueID: string, resourceType: string) => {

    const url = _baseUrl;
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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(response => {
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

        return fetcher(companyID, resourceID, resourceType);
    }


    return { fetchReport, abort: abortController };
}