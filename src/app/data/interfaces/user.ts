import type { Monitoring } from '.';

export interface User  {
	id: string;
	company_id: string;
	company_name: string;
	company_access_ids: string;
	fname: string;
	lname: string;
	username?: string;
	role: string;
	access_role: string;
	phone: number | string;
	email: string;
	password?: string;
	id_verified?: string;
	mfa_llave?: string;
	profile_media?: string;
	pais?: string;
	pais_code?: string;
	pais_provincia?: string;
	pais_ciudad?: string;
	reseller_id?: string;
	reseller_name?: string;
	eliminado?: string;
	creacion?: string;
	exp?: number;
}
