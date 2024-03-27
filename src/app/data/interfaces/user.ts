import type { Monitoring } from '.';

export interface User extends Monitoring {
	id?: string;
	companyID: string;
	companyAccessIds: string;
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
	companyRole: string;
	exp?: number;
}

