import type { ReactNode } from 'react';

export type KeyPress = 'Escape' | 'NONE';
export interface FetchPattern<D> {
  error: null | Error;
  data: D | null;
  isLoading: boolean;
}
export type ScopeAlias = 'w' | 'm' | 'c' | 's' | 'sc' | 'n' | 'r' | 'u';

export type ID = { id: string };

export type CompanyID = { company_id: string };

export interface AuditData extends ID {
  eliminado: string | boolean;
  creacion: string;
}

export interface AuditCompanyData extends ID, CompanyID {
  eliminado: string;
  creacion: string;
}

export interface CompanyData {
  company_name: string;
  company_web: string;
  company_size: string;
  company_area: string;
}

export interface OwnerData {
  owner_fname: string;
  owner_lname: string;
  owner_role: string;
  owner_email: string;
  owner_phone: string;
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

export interface ComponentEvent {
  onDone?: () => void;
  close?: () => void;
}

export interface ComponentEventWithOpen extends ComponentEvent {
  isOpen?: boolean;
}

export interface ComponentEventWithChildren {
  onDone?: () => void;
  close?: () => void;
  children: (isLoading: boolean) => ReactNode;
}

export interface EmptyFallbackData {
  type: string;
  title: string;
  subtitle: string;
  btnText: string;
}
