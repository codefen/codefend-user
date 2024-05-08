export interface Issue {
	company_id: string;
	condicion: string;
	creacion: string;
	eliminado: string;
	id: string;
	name: string;
	price: string;
	price_paid: string;
	researcher_id: string;
	researcher_username: string;
	resource_class: string;
	resource_id: string;
	risk_level: string;
	risk_score: string;
  }

  export interface IssueCondition {
    fixed: string;
    open: string;
    total: string;
  }

  export interface IssueRiskLevels {
    critical: string;
    elevated: string;
    intel: string;
    low: string;
    medium: string;
    total: string;
  }

  export interface CompanyMember {
    company_id: string;
    creacion: string;
    eliminado: string;
    email: string;
    fname: string;
    id: string;
    lname: string;
    pais: string;
    pais_ciudad: string;
    pais_code: string;
    pais_provincia: string;
    phone: string;
    profile_media: string;
    role: string;
   }

   export interface ResourceCount {
    cloud: string;
    lan: string;
    mobile: string;
    social: string;
    source: string;
    web: string;
  }

export interface DashboardPropsV2 {
	issues: Issue[];
	issues_condicion: IssueCondition;
	issues_share: IssueRiskLevels;
	members: CompanyMember[];
	resources: ResourceCount;
}