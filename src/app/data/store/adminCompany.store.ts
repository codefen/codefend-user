import { create } from "zustand";
import { ID, Monitoring, defaultCompanyCardData, equalsObj } from "..";

export interface AdminCompany extends ID, Monitoring {
    name: string;
    web: string;
    mercado: string;
    size: string;
    pais_code: string;

    pais: string;
    pais_provincia: string;
    pais_ciudad: string;

    owner_fname: string;
    owner_lname:string;
    owner_role: string;
    owner_email: string;
    owner_phone: string;
    orders_size: string;
    profile_media: string;
}

export interface AdminCompanyState {
    companies: AdminCompany[];
    companySelected: AdminCompany | null;
    searchQuery: string;
    initCompanies: ()=> void;
    isSelectedCompany: (company: AdminCompany)=>boolean;
    selectCompany: (company: AdminCompany)=>void;
    updateSearch: (updated: string)=>void;
    updateCompanies: (updated: AdminCompany[])=>void;
}

const equals = (first:any,second:any)=>equalsObj(first, second);

const companySelectedFromLocalStorage = localStorage.getItem('companySelected');
const defaultCompanySelected = companySelectedFromLocalStorage !== null
    ? JSON.parse(companySelectedFromLocalStorage)
    : null;

const useAdminCompanyStore = create<AdminCompanyState>((set, get)=>({
    companies: [],
    companySelected: defaultCompanySelected,
    searchQuery: "",
    selectCompany: (company: AdminCompany)=> {
        const state = get();

        if(!equals(state.companySelected, company)){
            set((current)=> ({...current, companySelected: company}));
            localStorage.setItem('companySelected', JSON.stringify(company));
        } else {
            set((current)=> ({...current, companySelected: null}));
            localStorage.removeItem('companySelected');
        }

    },
    isSelectedCompany: (company: AdminCompany)=> equals(company, get().companySelected),
    initCompanies: ()=>{
        
    },
    updateSearch: (updated: string)=> set((prev: AdminCompanyState)=> ({...prev, searchQuery: updated})),
    updateCompanies: (updated: AdminCompany[])=> set((prev: AdminCompanyState)=> ({...prev, companies: updated}))
}));

export default useAdminCompanyStore;