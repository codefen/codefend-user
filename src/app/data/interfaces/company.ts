import type { AuditData, LocationData, OwnerData } from './util';

export interface Company extends AuditData, LocationData, OwnerData {
  name: string;
  class: string;
  sub_class: string;
  reseller_revenue_share: string;
  web: string;
  mercado: string;
  size: string;
  address: string;
  admin_user_id: string;
  admin_user_name: string;
  admin_user_email: string;

  profile_media: string;
  orders_size: string;
  reseller_id: string;
  reseller_name: string;
}
