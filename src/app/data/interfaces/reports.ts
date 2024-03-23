import type { Issues, Webresources, IssuesShare, ReportIssues } from ".";

export interface WebReport {
	resources: Webresources[];
	issues: ReportIssues[];
	issueShare: IssuesShare;
}

export interface ResourceScope<T> {
	isLoading: boolean;
	resources: T;
}

export interface ResourceScopeApp<T> extends ResourceScope<T>{
	type: string;
}