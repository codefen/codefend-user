import { create } from "zustand";
import { ID, Monitoring, defaultCompanyCardData, equalsObj } from "..";

export interface AdminCompany extends ID, Monitoring {
    id: string;
    name: string;
    website: string;
    market: string;
    size: string;
    country: string;
    city: string;

    countryCode: string;
    province: string;
    address: string;

    ownerName: string;
    ownerLastname:string;
    ownerRole: string;
    ownerEmail: string;
    ownerPhone: string;
    orderSize: string;
    profileMedia: string;

}

export interface AdminCompanyState {
    companies: AdminCompany[];
    companySelected: AdminCompany | null;
    searchQuery: string;
    initCompanies: ()=> void;
    isSelectedCompany: (company: AdminCompany)=>boolean;
    selectCompany: (company: AdminCompany)=>void;
    updateSearch: (updated: string)=>void;
}

const equals = (first:any,second:any)=>equalsObj(first, second);

const useAdminCompanyStore = create<AdminCompanyState>((set, get)=>({
    companies: defaultCompanyCardData,
    companySelected: null,
    searchQuery: "",
    selectCompany: (company: AdminCompany)=> {
        const state = get();
      
        if(!equals(state.companySelected, company)){
            set((current)=> ({...current, companySelected: company}));
        } else {
            set((current)=> ({...current, companySelected: null}));
        }

    },
    isSelectedCompany: (company: AdminCompany)=> equals(company, get().companySelected),
    initCompanies: ()=>{
        
    },
    updateSearch: (updated: string)=> set((prev: AdminCompanyState)=> ({...prev, searchQuery: updated}))
}));

export default useAdminCompanyStore;