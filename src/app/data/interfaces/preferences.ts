import type { FullOrder } from "./order";

export interface MemberInfo {
	id: string;
	company_id: string;
	fname: string;
	lname: string;
	role: string;
	email: string;
	phone: string;
	profile_media: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	eliminado: string;
	creacion: string;
}

export interface CompanyInfo {
	id: string;
	name: string;
	web: string;
	mercado: string;
	size: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	address: string;
	owner_fname: string;
	owner_lname: string;
	owner_role: string;
	owner_email: string;
	owner_phone: string;
	profile_media: string;
	orders_size: string;
	eliminado: string;
	creacion: string;
}

export interface CompanyOrders extends FullOrder{
	provider_username: string;
}