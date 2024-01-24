import { Monitoring } from '.';
import { UserAPI } from './auth';

// Interface para la propiedad 'user'
export interface UserRegResponse {
	id: string;
	lead_fname: string;
	lead_lname: string;
	company_area: string;
	company_name: string;
	company_size: string;
	company_web: string;
	condicion: string;
	creacion: string;
	eliminado: string;
	lead_email: string;
	lead_from_alliance: string;
	lead_hci: string;
	lead_hxff: string;
	lead_pais: string;
	lead_pais_ciudad: string;
	lead_pais_code: string;
	lead_pais_provincia: string;
	lead_phone: string;
	lead_ra: string;
	lead_reference_number: string;
	lead_role: string;
	lead_ua: string;
	order_size: string;
	password: string;
	username: string;
}

export interface RegResponse {
	error: string;
	info: string;
	leads: UserRegResponse;
	response: string;
}

export interface UserFinishResponse {
	id: string;
	company_id: string;
	fname: string;
	lname: string;
	access_role: string;
	creacion: string;
	eliminado: string;
	email: string;
	mfa_llave: string;
	pais: string;
	pais_ciudad: string;
	pais_code: string;
	pais_provincia: string;
	password: string;
	phone: string;
	profile_media: string;
	role: string;
	username: string;
}

export interface RegFinishResponse {
	message: string;
	response: string;
	session: string;
	user: UserFinishResponse;
}

export interface User extends Monitoring {
	id?: string;
	companyID: string;
	accessRole: string;
	mfaKey: string;
	role: string;
	name: string;
	lastName: string;
	username?: string;
	password?: string;
	email: string;
	phone: number | string;
	profileMedia?: string | null;
	country?: string;
	countryCode: string;
	companySize?: string | number;
	companyName?: string;
	companyRole: string;
	companyWeb?: string;
	companyCountry?: string;
	exp?: number;
}

export type UserStore = Omit<User, 'id' | 'phone' | 'companyName' | 'exp'>;

export type UserRegister = Omit<
	User,
	| 'id'
	| 'companyID'
	| 'mfaKey'
	| 'accessRole'
	| 'isDisabled'
	| 'createdAt'
	| 'profile_media'
	| 'countryCode'
	| 'country'
	| 'exp'
> & { phase: string };

export type UserLogin = Omit<
	User,
	| 'id'
	| 'password'
	| 'name'
	| 'phone'
	| 'companySize'
	| 'companyName'
	| 'companyRole'
	| 'companyWeb'
	| 'companyCountry'
	| 'exp'
>;

// Interface para 'RegistrationData'
export interface RegistrationData {
	response: 'success';
	message: string;
	session: string;
	user: UserAPI;
}
