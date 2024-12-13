import type { FullOrder } from './order';
import type { AuditCompanyData, LocationData, ContactData, AuditData, OwnerData } from './util';

export interface MemberInfo extends AuditCompanyData, LocationData, ContactData {
  role: string;
  profile_media: string;
}

export interface CompanyInfo extends LocationData, AuditData, OwnerData {
  name: string;
  web: string;
  mercado: string;
  size: string;
  address: string;
  profile_media: string;
  orders_size: string;
}

export interface CompanyOrders extends FullOrder {
  provider_username: string;
}
