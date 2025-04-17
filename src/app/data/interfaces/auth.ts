import type { User } from '.';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  lead_fname: string;
  lead_lname?: string;
  lead_email: string;
  lead_phone?: string;
  company_name: string;
  company_web: string;
  company_size: string | number;
  company_area: string;
  reseller_name: string;
  reseller_id: string;
  idiom: string;
}

export interface LoginResponse {
  user?: User;
  token?: string;
  response: string;
  message?: string;
}

export interface RegisterFinishParams {
  username: string;
  password: string;
  lead_reference_number: string | undefined;
}
