import type { User } from "..";

export const EMPTY_USER:User = {
	id: "",
	company_id: "",
	company_name: "",
	company_access_ids: "",
	fname: "",
	lname: "",
	username: "",
	role: "",
	access_role: "",
	email: "",
	phone: "",
	password: "",
	id_verified: "",
	mfa_llave: "",
	profile_media: "",
	pais: "",
	pais_code: "",
	pais_provincia: "",
	pais_ciudad: "",
	reseller_id: "",
	reseller_name: "",
	eliminado: "",
	creacion: "",
	exp: 0,
}

export const EMPTY_COMPANY = {
	id: "",
	name: "unknow",
	web: "",
	size: "",
	pais_code: "",
	pais: "",
	pais_provincia: "",
	pais_ciudad: "",
	owner_fname: "",
	owner_lname: "",
	owner_role: "",
	owner_email: "",
	owner_phone: "",
	orders_size: "",
	profile_media: "",
	mercado: "",
	isDisabled: false,
	createdAt: ""
};
export const EMPTY_COMPANY_CUSTOM = {
	id: "",
	name: "unknow",
	web: "",
	size: "",
	pais_code: "",
	pais: "",
	pais_provincia: "",
	pais_ciudad: "",
	owner_fname: "",
	owner_lname: "",
	owner_role: "",
	owner_email: "",
	owner_phone: "",
	orders_size: "",
	profile_media: "",
	mercado: "",
	eliminado: "0",
	creacion: ""
};

export const EMPTY_PROVIDER = {
	name: "",
	img: "",
	username: "",
	score: "",
	reviews: "",
	desc: "",
	specialist: "",
}

export const EMPTY_SHARE = {
	total: "0",
	critical: "0",
    elevated: "0",
    medium: "1",
    low: "0",
    intel: "0",
}