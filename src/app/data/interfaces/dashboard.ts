import type { AuditCompanyData, ContactData, LocationData } from './util';

export interface Issue extends AuditCompanyData {
  condicion: string;
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

export interface CompanyMember extends ContactData, AuditCompanyData, LocationData {
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
