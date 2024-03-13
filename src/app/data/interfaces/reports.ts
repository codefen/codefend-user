import { Issues, Webresources, IssuesShare, ReportIssues } from ".";

export interface WebReport {
	resources: Webresources[];
	issues: ReportIssues[];
	issueShare: IssuesShare;
}