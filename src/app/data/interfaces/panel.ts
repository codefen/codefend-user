import type { ID, Monitoring, ResourceID } from '.';

export interface Company extends ID, Monitoring {
	name: string;
	web: string;
	country: string;
	size: string;
	market: string;
	countryCode: string;
	countryProvince: string;
	countryCity: string;
	address: string;

	ownerName: string;
	ownerLastname: string;
	ownerRole: string;
	ownerEmail: string;
	ownerPhone: string;
	profileMedia: string;
	orderSize: string;
}

export interface Resouce extends ResourceID, Monitoring {
	resourceDomain: string;
	resourceDomainDad: string;
	servers: string;
	mainServer: string;
	serverCountry: string;
	serverCountryCode: string;
	serverCountryProvince: string;
	serverCountryCity: string;
	issueCount: string;
}

export interface Webresources extends Resouce {
	childs: Resouce[];
}

export interface CompanyResource {
	web: string | number;
	mobile: string | number;
	cloud: string | number;
	lan: string | number;
	source: string | number;
	social: string | number;
}
export interface IssuesShare {
	total: string | number;
	critical: string | number;
	elevated: string | number;
	medium: string | number;
	low: string | number;
	intel: string | number;
}
export interface IssuesCondition {
	total: string | number;
	fixed: string | number;
	open: string | number;
}

export interface CompanyMember extends ResourceID, Monitoring {
	name: string;
	lastName: string;
	companyRole: string;
	email: string;
	phone: string;
	profileMedia: string;
	country: string;
	countryCode: string;
	countryProvince: string;
	countryCity: string;
}

export interface Issues extends ResourceID, Monitoring {
	resourceClass: string;
	resourceID: string;
	researcherID: string;
	researcherUsername: string;
	riskLevel: string;
	riskScore: string;
	name: string;
	condition: string;
	price: string;
	pricePaid: string;
}
export interface ReportIssues extends Issues {
	content: string;
	totalIssues: string;

}
export interface CompleteIssue extends Issues {
	content: string;
	cs: null | IssueMessage[];
}

export interface IssueMessage extends ResourceID, Monitoring {
	issueID: string;
	userID: string;
	userUsername: string;
	userCompany: string;
	body: string;
}

export interface DashboardProps {
	company: Company;
	members: CompanyMember[];
	resources: CompanyResource;
	issues: Issues[];
	issuesShare: IssuesShare;
	issuesCondition: IssuesCondition;
}

export interface WebapplicationProps {
	company: Company;
	resources: Webresources[];
}

export interface MobileApp extends ResourceID, Monitoring {
	appOS: string;
	appName: string;
	appLink: string;
	appAppleSubheader: string;
	appDeveloper: string;
	appDesc: string;
	appRank: string;
	appReviews: string;
	appAndroidDownloads: string;
	appMedia: string;
}

export interface UniqueApps {
	creds: {} | null;
	issues: Issues[];
	issueShare: IssuesShare;
	issueCondition: IssuesCondition;
}

export interface MobileUnique extends MobileApp, UniqueApps {
}
export interface CloudUnique extends CloudApp, UniqueApps {
}

export interface MobileProps {
	error: string;
	available: MobileApp[];
}

export interface CloudApp extends ResourceID, Monitoring {
	appName: string;
	appDesc: string;
	cloudProvider: string;
	cloudFirstKey: string;
	cloudSecondKey: string;
	cloudThirdKey: string;
	appMedia: string;
}
export interface IssueClass {
	total: string;
	web: string;
	mobile: string;
	infra: string;
	source: string;
	social: string;
	research: string;
}

export interface AllIssues {
	issues: Issues[];
	issueClass: IssueClass;
	issueShare: IssuesShare;
	issueCondition: IssuesCondition;
}

export interface SourceCode extends ResourceID, Monitoring {
	name: string;
	accessLink: string;
	isPublic: string;
	sourceCode: string;
}

export enum ChartValueType {
	SOURCE_CODE,
	PLAIN,
	NETWORK_OS,
}

export interface Network extends ResourceID, Monitoring {
	device_in_address: string;
	device_ex_address: string;
	device_os: string;
	device_vendor: string;
	device_name: string;
	childs?: Network[];
}

export enum ChatBoxType {
	ISSUE,
	SUPPORT,
}
export type DeviceChild = Omit<Device, "childs">;

export interface Device {
	id: string;
	company_id: string;
	device_in_address: string;
	access_username: string;
	access_password: string;
	creacion: string;
	device_ex_address: string;
	device_name: string;
	device_os: string;
	device_vendor: string;
	device_version: string;
	device_desc: string; 
	eliminado: string;
	pem: string;
	ppk: string;
	resource_lan_dad: string;
	childs?: DeviceChild[] | null;
}

export interface DeviceListResponse {
	disponibles: Device[];
	eliminados: null | any;
	error: string;
	info: string;
}

export interface OneIssue {
	company: Company | null;
	issue: CompleteIssue | null;
}

export interface Member {
	id: string;
	company_id: string;
	fname: string;
	lname: string;
	role: string;
	email: string;
	phone: string;
	profile_media: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	eliminado: string;
	creacion: string;
}

export interface MemberV2 {
	id: string;
	company_id: string;
	member_fname: string;
	member_lname: string;
	member_email: string;
	member_phone: string;
	member_role: string;
	eliminado: string;
	creacion: string;
}

export interface SuperMember extends Member, MemberV2 {}

export interface SocialRoles {
	total: string;
	administrative: string;
	customer_service: string;
	finance: string;
	human_resources: string;
	information_tech: string;
	marketing: string;
	production_operations: string;
	sales: string;
	strategy_planning: string;
}

export interface SocialProps {
	response: string;
	company: Company;
	issues: Issues[];
	resources: CompanyResource;
	members: Member[];
	issues_share: IssuesShare;
	issues_condicion: IssuesCondition;
}

export interface CompanyInfo extends ID {
	name: string;
	web: string;
	mercado: string;
	size: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	address: string;
	owner_fname: string;
	owner_lname: string;
	owner_role: string;
	owner_email: string;
	owner_phone: string;
	profile_media: string;
	orders_size: string;
	eliminado: string;
	creacion: string;
}

export interface Ticket extends ID{
	company_id: string;
	dad_id: string;
	user_id: string;
	user_email: string;
	user_username: string;
	cs_header: string;
	cs_body: string;
	condicion: string;
	eliminado: string;
	creacion: string;
}

export interface TicketWithChild extends Ticket {
	childs: Ticket[];
}

export interface PreviusSearch extends ResourceID, Monitoring {
	userID: string;
	username: string;
	model: string;
	info: string;
	addressRA: string;
	addressHCI: string;
	addressHXFF: string;
	userCountry: string;
	userCountryCode: string;
	userCountryProvince: string;
	userCountryCity: string;
	userUA: string;
	condition: string;
}

export interface VdbResponseSearch {
	version: string;
	format: string;
	status: string;
	monblock: string;
	items: number;
	consumption: number;
	remaining: number;
	querylimit: number;
	querylimitmax: number;
	timestamp: string;
	rtt: number;
	etag: string;
}

export interface VdbRequestSearch {
	timestamp: string;
	apiKey: string;
	userID: string;
	details: number;
	sort: string;
	cti: number;
	type: string;
	value: string;
}

export interface TimeStamp {
	create: string;
	change: string;
}
export interface ResultsVdbSearch {
	entry: {
		id: string;
		title: string;
		timestamp: TimeStamp;
	};
	vulnerability: {
		risk: {
			value: string;
			name: string;
		};
	};
	advisory: {
		date: string;
	};
	source: {
		cve: {
			id: string;
		};
	};
}

export interface VdbProps {
	response: VdbResponseSearch;
	request: VdbRequestSearch;
	result?: ResultsVdbSearch[];
}
export interface ResultsVdbSearchV2 {
	id: string;
	entryID: string;
	title: string;
	vulnerability: string;
	createdAt: string;
	updatedAt: string;
	riskScore: string;
	riskName: string;
	type: string;
}