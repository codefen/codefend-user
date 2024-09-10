import type { AuditCompanyData } from './util';

export interface ResourceCredential extends AuditCompanyData {
  resource_class: string;
  resource_id: string;
  email: string;
  username: string;
  password: string;
  access_level: string;
  info: string;
  publisher_id: string;
  publisher_username: string;
  publisher_email: string;
}
