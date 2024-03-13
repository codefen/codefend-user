import { toast } from "react-toastify";
import { useAuthState } from "../..";
import { IssueService, mapWebReportResources } from "../../../";

export const useIssueReport = ()=>{
    const { getCompany } = useAuthState();

    const fetcher = (companyID: string, issueID: string, resourceType:string)=>{
        return IssueService.generateInform(companyID, issueID, resourceType).then((res:any)=>{
            let response: any;

            if(resourceType === "web") response = mapWebReportResources(res);

            return response;
        });
    }

    const fetchReport = (issueID: string, resourceType:string)=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return Promise.resolve(false);
		}


        return fetcher(companyID, issueID, resourceType);
    }


    return { fetchReport };
}