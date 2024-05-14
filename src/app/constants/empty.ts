import { IssuesStatus } from "@interfaces/issues";
import type { User } from "../data";

export const EMPTY_USER:User = {
	id: "",
	company_id: "",
	company_name: "",
	company_access_ids: "",
	fname: "",
	lname: "",
	username: "",
	role: "",
	access_role: "",
	email: "",
	phone: "",
	password: "",
	id_verified: "",
	mfa_llave: "",
	profile_media: "",
	pais: "",
	pais_code: "",
	pais_provincia: "",
	pais_ciudad: "",
	reseller_id: "",
	reseller_name: "",
	eliminado: "",
	creacion: "",
	exp: 0,
}

export const EMPTY_COMPANY = {
	id: "",
	name: "unknow",
	sub_class: "",
	reseller_revenue_share: "0",
	web: "",
	size: "",
	pais_code: "",
	pais: "",
	pais_provincia: "",
	pais_ciudad: "",
	owner_fname: "",
	owner_lname: "",
	owner_role: "",
	owner_email: "",
	owner_phone: "",
	orders_size: "",
	profile_media: "",
	mercado: "",
	isDisabled: false,
	createdAt: ""
};
export const EMPTY_COMPANY_CUSTOM = {
	id: "",
	name: "unknow",
	web: "",
	size: "",
	pais_code: "",
	pais: "",
	pais_provincia: "",
	pais_ciudad: "",
	owner_fname: "",
	owner_lname: "",
	owner_role: "",
	owner_email: "",
	owner_phone: "",
	orders_size: "",
	profile_media: "",
	mercado: "",
	eliminado: "0",
	creacion: ""
};

export const EMPTY_PROVIDER = {
	name: "",
	img: "",
	username: "",
	score: "",
	reviews: "",
	desc: "",
	specialist: "",
}

export const EMPTY_SHARE = {
	total: "0",
	critical: "0",
    elevated: "0",
    medium: "1",
    low: "0",
    intel: "0",
}

export const EMPTY_ISSUECLASS = {
	total:     "0",
	web:       "0",
	mobile:    "0",
	infra:     "0",
	lan:       "0",
	source:    "0",
	social:    "0",
	research:  "0"
}

export const EMPTY_ISSUECONDITION = {
	total: "0",
	fixed: "0",
	open: "0"
}
export const EMPTY_ISSUEUPDATE = {
    id: "",
	researcher_username: "",
    resource_class: "",
    resource_id: "",
    risk_level: "",
    risk_score: "",
    name: "",
    issue: "",
    condicion: IssuesStatus.VOID,
    cs: [],
    creacion: "",
    eliminado: "0",
  };

  export const EMPTY_RESELLERHEADER ={
	final_sales_volume: "",
	sum_funds_full: "",
	sum_funds_reseller: "",
	balance_now: ""

  }

  export const EMPTY_DASHBOARD_PROPS = {
	issues: [],
	issues_condicion: {
	  fixed: "",
	  open: "",
	  total: ""
	},
	issues_share: {
	  critical: "",
	  elevated: "",
	  intel: "", 
	  low: "",
	  medium: "",
	  total: ""
	},
	members: [],
	resources: {
	  cloud: "",
	  lan: "",
	  mobile: "",
	  social: "",
	  source: "",
	  web: ""
	}
  };

  export const EMPTY_TICKET_WITHCHILD = {
	id: '', 
	company_id: '',
	dad_id: '',
	user_id: '',
	user_email: '',
	user_username: '',
	cs_header: '',
	cs_body: '',
	condicion: '',
	eliminado: '',
	creacion: '',
	childs: []
  };

  export const EMPTY_ISSUE_TICKET = {
	id: '', 
	company_id: '',
	issue_id: '',
	user_id: '',
	user_username: '',
	user_company: '',
	cs_header: '',
	issue_cs_body: '',
	eliminado: '',
	creacion: '',
	childs: []
  };