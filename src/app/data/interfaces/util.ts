export interface FetchPattern<D> {
	error: null | Error;
	data: D | null;
	isLoading: boolean;
}

export type ID = {id: string}

export type CompanyID = {company_id: string}

export interface AuditData extends ID{
    eliminado: string;
    creacion: string;
}

export interface AuditCompanyData extends ID, CompanyID{
    eliminado: string;
    creacion: string;
}

export interface CompanyData {
    company_name: string;
    company_web: string;
    company_size: string;
    company_area: string;
}

export interface LocationData {
    pais: string;
    pais_code: string;
    pais_ciudad: string;
    pais_provincia: string;
}

export interface ContactData {
    fname: string;
    lname: string;
    email: string;
    phone: string;
}