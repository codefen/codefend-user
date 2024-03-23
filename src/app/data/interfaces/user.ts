import type { Monitoring } from '.';

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

