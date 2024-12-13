import type { AuditCompanyData, ContactData, LocationData } from './util';

export interface Provider extends AuditCompanyData, LocationData, ContactData {
  company_access_ids: string;

  username: string;
  role: string;
  headline: string;
  id_verified: string | boolean;
  access_role: string;
  password: string;
  profile_media: string;
  mfa_llave: string;

  reseller_id: string;
  reseller_name: string;
  user_id: string;
  show_email_and_phone: string;
  business_phone: string;
  main_desc: string;
  finished_orders: number;
  score: number;
  reviews_final: number;
}
