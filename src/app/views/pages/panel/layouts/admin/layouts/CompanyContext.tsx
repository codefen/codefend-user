import { defaultCompanyCardData } from '../../../../../../data';
import React, { ChangeEvent, createContext, useContext, useState } from 'react';

interface Company {
	address?: any;
	web?: any;
	canRead?: boolean;
	name: string;
	id: string;
	website: string;
	size: string;
	country: string;
	city: string;
}

interface CompanyState {
	state: {
		companies: Company[];
		searchQuery: string;
		companyStore: Company;
	};
	actions: {
		isSelectedCompany: (company: Company) => boolean;
		handleClick: (company: Company) => void;
		handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	};
}

interface Props {
	children: React.ReactNode;
}

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyContextProvider');
  }
  return context;
};

export const CompanyContext = createContext({} as CompanyState);

export const CompanyContextProvider = ({ children }: Props) => {
	const emptyCompany: Company = {
		name: '',
		id: '',
		website: '',
		size: '',
		country: '',
		city: '',
	};

	const initialState: CompanyState['state'] = {
		companies: defaultCompanyCardData,
		searchQuery: '',
		companyStore: emptyCompany,
	};

	const [{ companies, companyStore, searchQuery }, setCompanyState] =
		useState(initialState);

	const isSelectedCompany = (company: any) => {
		if (!company || !company?.id) return false;

		const selected = companyStore?.id === company?.id;
		return selected;
	};

	const handleClick = (company: Company) => {
    setCompanyState((prevState: any) => {
      if (isSelectedCompany(company)) {
        return { ...prevState, companyStore: null };
      } else {
        return { ...prevState, companyStore: company };
      }
    });
  };

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCompanyState((prevUserState: any) => ({
			...prevUserState,
			[name]: value,
		}));
	};

	return (
		<CompanyContext.Provider
			value={{
				state: {
					companies,
					companyStore,
					searchQuery,
				},
				actions: {
					handleChange,
					handleClick,
					isSelectedCompany,
				},
			}}>
			{children}
		</CompanyContext.Provider>
	);
};
