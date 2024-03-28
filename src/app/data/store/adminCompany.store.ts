import { type StateCreator, create } from "zustand";
import { type ID, type Monitoring, emptyCompany, equalsObj, getFullCompanyFromUser } from "..";
import { type PersistOptions, devtools, persist } from "zustand/middleware";

export interface AdminCompany extends ID, Monitoring {
    name: string;
    web: string;
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

    mercado?: string;
}

export interface AdminCompanyState {
    companies: AdminCompany[];
    companySelected: AdminCompany;
    searchQuery: string;
    isSelectedCompany: (company: AdminCompany)=>boolean;
    selectCompany: (company: AdminCompany, ignore?:boolean)=>void;
    updateSearch: (updated: string)=>void;
    updateCompanies: (updated: AdminCompany[])=>void;
    reset: ()=> void;
}

const equals = (first:any,second:any)=>equalsObj(first, second);

const defaultCompanySelected = getFullCompanyFromUser() as AdminCompany;
const companyEMPTY = emptyCompany;

const stateInitV2 = (store: StateCreator<AdminCompanyState>, persistence: PersistOptions<any,string>) =>
	devtools(persist(store, persistence)) as StateCreator<
    AdminCompanyState,
		[],
		[['zustand/persist', string]]
	>;
    
const useAdminCompanyStore = create<AdminCompanyState>()(stateInitV2((set, get)=>({
    companies: [],
    companySelected: defaultCompanySelected,
    searchQuery: "",
    selectCompany: (company: AdminCompany, ignore?: boolean)=> {
        const state = get();

        if(!equals(state.companySelected, company) || ignore){
            set((current)=> ({...current, companySelected: company}));
        } else {
            set((current)=> ({...current, companySelected: companyEMPTY}));
        }

    },
    isSelectedCompany: (company: AdminCompany)=> equals(company, get().companySelected),
    reset: ()=>{
        set((state)=> ({...state, companySelected: companyEMPTY, companies: [] as AdminCompany[]}))
    },
    updateSearch: (updated: string)=> set((prev: AdminCompanyState)=> ({...prev, searchQuery: updated})),
    updateCompanies: (updated: AdminCompany[])=> {
        const state = get();
        set((prev: AdminCompanyState)=> ({...prev, 
            companies: updated, 
            companySelected: updated[0]
        }));
    }
}),
{

    name: 'adminStore'
}));

export default useAdminCompanyStore;