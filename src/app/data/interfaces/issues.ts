import type { AuditCompanyData, AuditData } from "./util";

export enum IssuesStatus {
	OPEN="open", VERIFIED="verified", FIXED="fixed",VOID=""
}

export interface Issue extends AuditCompanyData{
    resource_class: string;
    resource_id: string;
    researcher_id: string;
    researcher_username: string;
    risk_level: string;
    risk_score: string;
    name: string;
    issue: string;
    condicion: string;
    price: string;
    price_paid: string;
    cs: string;
}

export interface IssueUpdateData extends AuditData{
    researcher_username: string;
    resource_class: string;
    resource_id: string;
    risk_level: string;
    risk_score: string;
    name: string;
    issue: string;
    condicion: IssuesStatus;
    cs: any[];
}
