import type { Update } from '@tauri-apps/plugin-updater';
import type { AuditCompanyData, ContactData, LocationData } from '.';

export interface User extends AuditCompanyData, LocationData, ContactData {
  company_name: string;
  company_access_ids: string;
  username?: string;
  role: string;
  access_role: string;
  password?: string;
  id_verified?: string;
  mfa_llave?: string;
  profile_media?: string;
  reseller_id?: string;
  reseller_name?: string;
  exp?: number;
}

export interface ResellerUser extends ContactData, LocationData, AuditCompanyData {
  company_name: string;
  company_access_ids: string;
  username?: string;
  role: string;
  access_role: string;
  password?: string;
  id_verified?: string;
  mfa_llave?: string;
  profile_media?: string;
  reseller_id?: string;
  reseller_name?: string;
}

export interface UpdateAppState {
  hasUpdate: boolean;
  acceptUpdate?: boolean;
  rejectUpdate?: boolean;
  update?: Update;
}
