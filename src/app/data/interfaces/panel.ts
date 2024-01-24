import { ID, Monitoring, ResourceID } from '.';

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
	issues: Issues[];
	members: CompanyMember[];
	resources: CompanyResource;
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

export interface MobileUnique extends MobileApp {
	creds: {} | null;
	issues: Issues;
	issueShare: IssuesShare;
	issueCondition: IssuesCondition;
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
	eliminado: string;
	pem: string;
	ppk: string;
	resource_lan_dad: string;
	childs?: Device[] | null;
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

export interface SupportProps extends ResourceID, Monitoring {
	dadID: string;
	userID: string;
	userEmail: string;
	userUsername: string;
	csHeader: string;
	csBody: string;
	condition: string;
}

export interface TicketUnique extends SupportProps {
	childs: SupportProps[];
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
	results?: ResultsVdbSearch[];
}
/* 
  "result": [
        {
            "entry": {
                "id": "248418",
                "title": "Mozilla Firefox up to 120 Protocol denial of service",
                "timestamp": {
                    "create": "1703000860",
                    "change": "1705099665"
                }
            },
            "vulnerability": {
                "risk": {
                    "value": "1",
                    "name": "low"
                }
            },
            "advisory": {
                "date": "1702940400"
            },
            "source": {
                "cve": {
                    "id": "CVE-2023-6871"
                }
            }
        },


"session": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyaWQiOiIxMDkiLCJleHAiOjE3MDU2MjUyNTd9.HivlkCsh5vAtxgWis5yA7B0rxmF14utrN13OaemyRlw",
    "user": {
        "id": "109",
        "company_id": "1",
        "fname": "Marcos",
        "lname": "Lopez",
        "username": "marcosIC",
        "role": "Web Developers",
        "access_role": "user",
        "email": "lopezikaro16@gmail.com",
        "phone": "3757588790",
        "password": "ad2671d23541251a1ecf8a06d2f8f386b8cfd07e62007349d20920fb6c50413f",
        "mfa_llave": "disabled",
        "profile_media": "",
        "pais": "Argentina",
        "pais_code": "AR",
        "pais_provincia": "Buenos Aires",
        "pais_ciudad": "Florentino Ameghino",
        "eliminado": "0",
        "creacion": "2023-12-28 19:34:38"
    },
*/
