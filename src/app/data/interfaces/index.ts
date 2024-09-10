export type ID = {
  id: string;
};
export type CompanyID = {
  companyID: string;
};

export type Monitoring = {
  isDisabled: boolean;
  createdAt: string;
};
export interface ResourceID extends ID, CompanyID {}

export * from './user';
export * from './panel';
export * from './auth';
export * from './util';
export * from './order';
export * from './reports';
export * from './table';
export * from './helperbox';
