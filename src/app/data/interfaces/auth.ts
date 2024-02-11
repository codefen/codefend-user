import { User } from '.';

export interface LoginParams {
	email: string;
	password: string;
}

//paso 1
export interface RegisterParams {
	lead_fname: string;
	lead_lname?: string;
	lead_role: string | number;
	lead_email: string;
	lead_phone?: string;
	company_name: string;
	company_web: string;
	company_size: string | number;
	company_area: string;
	phase: string;
}

// Tipo de retorno de la función de inicio de sesión
export interface LoginResponse {
	user?: User;
	token?: string;
	response: string;
	message?: string;
}

// Tipo de retorno de la función de registro
export interface RegisterResponse {
	_id: string;
	username: string;
	email: string;
	password: string;
	role: string;
	name: string;
	companySize: string;
	companyRole: string;
	companyWeb: string;
	companyCountry: string;
}

// Tipo de Usuario que retorna la API en el Login
export interface UserAPI {
	id: string;
	company_id: string;
	fname: string;
	lname: string;
	username: string;
	role: string;
	access_role: string;
	email: string;
	phone: string;
	password: string;
	mfa_llave: string;
	profile_media: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	eliminado: string;
	creacion: string;
	exp?: number;
}

export interface RegisterFinishParams {
	username: string;
	password: string;
	lead_reference_number: string | undefined;
}
