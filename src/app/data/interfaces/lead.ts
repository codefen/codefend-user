import type { AuditData, CompanyData } from './util';

export interface Lead extends CompanyData, AuditData {
  lead_fname: string;
  username: string;
  password: string;
  lead_lname: string;
  lead_email: string;
  lead_phone: string;
  reseller_id: string;
  reseller_name: string;
  lead_ra: string;
  lead_hci: string;
  lead_hxff: string;
  lead_pais: string;
  lead_pais_code: string;
  lead_pais_provincia: string;
  lead_pais_ciudad: string;
  lead_ua: string;
  lead_reference_number: string;
  order_size: string;
  condicion: string;
}
