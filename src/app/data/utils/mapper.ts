import {
	AllIssues,
	CloudApp,
	Company,
	DashboardProps,
	IssueMessage,
	Issues,
	IssuesCondition,
	IssuesShare,
	MobileApp,
	MobileProps,
	MobileUnique,
	OneIssue,
	PreviusSearch,
	SourceCode,
	SupportProps,
	TicketUnique,
	User,
	UserAPI,
	VdbProps,
	VdbRequestSearch,
	WebapplicationProps,
	Webresources,
	cleanReview,
	formatDate,
	mapEpochToDate,
} from '..';

/** Map @interface UserAPi => @interface User */
export const mapLoginResponseToUser: (response: UserAPI) => User = (
	response: UserAPI,
) => {
	return {
		id: response.id,
		companyID: response.company_id,
		name: response.fname,
		lastName: response.lname,
		username: response.username,
		companyRole: response.role,
		accessRole: response.access_role,
		email: response.email,
		phone: response.phone,
		password: response.password,
		mfaKey: response.mfa_llave,
		profileMedia: response.profile_media,
		companyCountry: response.pais,
		country: response.pais,
		countryCode: response.pais_code,
		isDisabled: response.eliminado === '1',
		createdAt: response.creacion,
	} as User;
};

/** Map company api data => @interface Company   */
export const mapCompany = (source: any): Company => {
	return {
		id: source.id,
		name: source.name,
		web: source.web,
		size: source.size,
		country: source.pais,
		market: source.mercado,
		countryCode: source.pais_code,
		countryProvince: source.pais_provincia,
		countryCity: source.pais_ciudad,
		address: source.address,
		ownerName: source.owner_fname,
		ownerLastname: source.owner_lname,
		ownerRole: source.owner_role,
		ownerEmail: source.owner_email,
		ownerPhone: source.owner_phone,
		profileMedia: source.profile_media,
		orderSize: source.profile_media,
		isDisabled: source.eliminado === '1',
		createdAt: source.creacion,
	};
};

/** Map issues api data => @interface Issues */
export const mapIssues = (source: any): Issues => {
	return {
		id: source.id,
		companyID: source.company_id,
		resourceClass: source.resource_class,
		resourceID: source.resource_id,
		researcherID: source.researcher_id,
		researcherUsername: source.researcher_username,
		riskLevel: source.risk_level,
		riskScore: source.risk_score,
		name: source.name,
		condition: source.condicion,
		price: source.price,
		pricePaid: source.price_paid,
		isDisabled: source.eliminado,
		createdAt: source.creacion,
	} as Issues;
};
/** Map issue share api data => @interface IssuesShare */
export const mapIssueShare = (source: any): IssuesShare => {
	return {
		critical: source.issues_share.critical,
		elevated: source.issues_share.elevated,
		medium: source.issues_share.medium,
		low: source.issues_share.low,
		intel: source.issues_share.intel,
		total: source.issues_share.total,
	};
};

/** Map issue condition api data => @interface IssuesCondition */
export const mapIssuesCondition = (source: any): IssuesCondition => {
	return {
		total: source.issues_condicion.total,
		fixed: source.issues_condicion.fixed,
		open: source.issues_condicion.open,
	};
};

/** Map dashboard company api data => @interface DashboardProps */
export const mapGetCompanyToCompanyData = (source: any): DashboardProps => {
	return {
		company: mapCompany(source.company),
		issues: source.issues
			? source.issues.map((issue: any) => mapIssues(issue))
			: [],
		resources: {
			web: source.resources.web,
			mobile: source.resources.mobile,
			cloud: source.resources.cloud,
			lan: source.resources.lan,
			source: source.resources.source,
			social: source.resources.social,
		},
		issuesShare: mapIssueShare(source),
		issuesCondition: mapIssuesCondition(source),
		members: source.members ? source.members.map((member: any) => ({
			id: member.id,
			companyID: member.company_id,
			name: member.fname,
			lastName: member.lname,
			companyRole: member.role,
			email: member.email,
			phone: member.phone,
			profileMedia: member.profile_media,
			country: member.pais,
			countryCode: member.pais_code,
			countryProvince: member.pais_provincia,
			countryCity: member.pais_ciudad,
			isDisabled: member.eliminado === '1',
			createdAt: member.creacion,
		})) : [],
	} as DashboardProps;
};

/** Map web resources api data => @interface Webresources */
export const mapWebresourceApiToWebresource = (source: any): Webresources => {
	return {
		id: source.id,
		companyID: source.company_id,
		resourceDomain: source.resource_domain,
		resourceDomainDad: source.resource_domain_dad,
		servers: source.servers,
		mainServer: source.main_server,
		serverCountry: source.server_pais,
		serverCountryCode: source.server_pais_code,
		serverCountryProvince: source.server_pais_provincia,
		serverCountryCity: source.server_pais_ciudad,
		isDisabled: source.eliminado === '1',
		createdAt: source.creacion,
		childs: source.childs
			? source.childs.map((child: any) => {
					return {
						id: child.id,
						companyID: child.company_id,
						resourceDomain: child.resource_domain,
						resourceDomainDad: child.resource_domain_dad,
						servers: child.servers,
						mainServer: child.main_server,
						serverCountry: child.server_pais,
						serverCountryCode: child.server_pais_code,
						serverCountryProvince: child.server_pais_provincia,
						serverCountryCity: child.server_pais_ciudad,
						isDisabled: child.eliminado === '1',
						createdAt: formatDate(child.creacion),
					};
				})
			: [],
	} as Webresources;
};

/** Map web resources and company api data => @interface WebapplicationProps */
export const mapToWebresourceProps = (source: any): WebapplicationProps => {
	return {
		company: mapCompany(source.company),
		resources: source.resources.map((resource: any) =>
			mapWebresourceApiToWebresource(resource),
		),
	};
};

/** Map mobile app api data => @interface MobileApp */
export const mapMobileApp = (source: any): MobileApp => {
	return {
		id: source.id,
		companyID: source.company_id,
		appOS: source.app_os,
		appName: source.app_name,
		appLink: source.app_link,
		appAppleSubheader: source.app_apple_subheader,
		appDeveloper: source.app_developer,
		appDesc: source.app_desc,
		appRank: source.app_rank,
		appReviews: cleanReview(source.app_reviews),
		appAndroidDownloads: source.app_android_downloads,
		appMedia: source.app_media,
		isDisabled: source.eliminado === '1',
		createdAt: formatDate(source.creacion),
	};
};

/** Map avalaible mobile apps from api => @interface MobileProps */
export const mapMobileProps = (source: any): MobileProps => {
	return {
		error: source.error,
		available: source.disponibles
			? source.disponibles.map((apps: any) => mapMobileApp(apps))
			: [],
	};
};
export const mapMobileAppsArray = (source: any): MobileApp[] => {
	return source.disponibles
		? source.disponibles.map((apps: any) => mapMobileApp(apps))
		: [];
};

/** Map mobile one api data => @interface MobileUnique */
export const mobileUniqueProps = (source: any): MobileUnique => {
	return {
		...mapMobileApp(source.unico),
		creds: source.unico.creds,
		issues: source.unico.issues,
		issueShare: mapIssueShare(source.unico),
		issueCondition: mapIssuesCondition(source.unico),
	};
};

/** Map cloud app api data => @interface CloudApp */
export const mapCloudApp = (source: any): CloudApp => {
	return {
		id: source.id,
		companyID: source.company_id,
		appName: source.cloud_name,
		appDesc: source.cloud_desc,
		cloudProvider: source.cloud_provider,
		cloudFirstKey: source.cloud_llave_1,
		cloudSecondKey: source.cloud_llave_2,
		cloudThirdKey: source.cloud_llave_3,
		appMedia: source.media,
		isDisabled: source.eliminado === '1',
		createdAt: formatDate(source.creacion),
	};
};

/** Map get all issues from api => @interface AllIssues */
export const mapAllIssues = (source: any): AllIssues => {
	return {
		issues: source.issues
			? source.issues.map((issue: any) => mapIssues(issue))
			: [],
		issueClass: source.issues_class,
		issueShare: mapIssueShare(source),
		issueCondition: mapIssuesCondition(source),
	};
};

/** Map source code api data => @interface SourceCode */
export const mapSourceCode = (source: any): SourceCode => {
	return {
		id: source.id,
		companyID: source.company_id,
		name: source.name,
		accessLink: source.access_link,
		isPublic: source.is_public,
		sourceCode: source.source_code,
		isDisabled: source.eliminado === '1',
		createdAt: source.creacion,
	};
};

export const mapIssueCS = (source: any): IssueMessage => {
	return {
		id: source.id,
		companyID: source.company_id,
		issueID: source.issue_id,
		userID: source.user_id,
		userUsername: source.user_username,
		userCompany: source.user_company,
		body: source.issue_cs_body,
		isDisabled: source.eliminado === '1',
		createdAt: formatDate(source.creacion),
	};
};

export const mapOneIssue = (source: any): OneIssue => {
	return {
		company: mapCompany(source.company),
		issue: {
			...mapIssues(source.issue),
			content: source.issue.issue,
			cs: source.issue.cs
				? source.issue.cs.map((cs: any) => mapIssueCS(cs))
				: null,
		},
	};
};

export const mapSupportProps = (source: any): SupportProps => {
	return {
		id: source.id,
		companyID: source.company_id,
		dadID: source.dad_id,
		userID: source.user_id,
		userEmail: source.user_email,
		userUsername: source.user_username,
		csHeader: source.cs_header,
		csBody: source.cs_body,
		condition: source.condicion,
		createdAt: source.creacion,
		isDisabled: source.eliminado == '1',
	};
};

export const mapTicketUnique = (source: any): TicketUnique => {
	return {
		...mapSupportProps(source.unico),
		childs:
			source.unico.childs !== null
				? source.unico.childs.map((child: any) => mapSupportProps(child))
				: [],
	};
};

export const mapPreviusSearch = (source: any): PreviusSearch => {
	return {
		id: source.id,
		companyID: source.company_id,
		userID: source.user_id,
		username: source.username,
		model: source.model,
		info: source.informacion,
		addressRA: source.address_ra,
		addressHCI: source.address_hci,
		addressHXFF: source.address_hxff,
		userCountry: source.user_pais,
		userCountryCode: source.user_pais_code,
		userCountryProvince: source.user_pais_provincia,
		userCountryCity: source.user_pais_ciudad,
		userUA: source.user_ua,
		condition: source.condicion,
		isDisabled: source.eliminado == '1',
		createdAt: source.creacion,
	};
};

export const mapIntelData = (source: any) => {
	return {
		...source,
		preview: '',
	};
};

export const mapVdbRequestSearch = (source: any): VdbRequestSearch => {
	return {
		...source,
		apiKey: source.apikey,
		userID: source.userid,
	};
};

export const mapVdbResults = (source: any) => {
	return {
		...source,
		advisory: {
			date: mapEpochToDate(source.advisory.date)
		}

	}
}

export const mapVdbSearch = (source: any): VdbProps => {
	return {
		response: source.response,
		request: mapVdbRequestSearch(source.request),
		result: source.result.map((result: any)=> mapVdbResults(result)),
	};
};
