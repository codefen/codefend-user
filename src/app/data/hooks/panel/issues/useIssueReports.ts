import { toast } from "react-toastify";
import { useAuthState } from "../..";
import { IssueService } from "../../../";

export const useIssueReport = ()=>{
    const { getCompany } = useAuthState();

    const fetcher = (companyID: string, issueID: string, resourceType:string)=>{
        IssueService.generateInform(companyID, issueID, resourceType).then((res:any)=>{
            console.log("Respuesta de reportes");
            console.log({res});
            console.log("----------------------------------------")
        });
    }

    const fetchReport = (issueID: string, resourceType:string)=>{
        const companyID = getCompany();
		if (!companyID) {
			toast.error('User information was not found');
			return;
		}

        fetcher(companyID, issueID, resourceType);
    }


    return { fetchReport };
}