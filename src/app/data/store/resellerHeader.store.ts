import { EMPTY_COMPANY, EMPTY_RESELLERHEADER } from '@/app/constants/empty';
import { create } from 'zustand';

export interface ResellerHeaderStore {
    company: any;
    reseller_header: any;

    setCompany: (company: any)=> void;
    setResellerHeader: (header:any)=>void;
}

const emptyCompany = EMPTY_COMPANY;
const emptyHeader = EMPTY_RESELLERHEADER;

const useResellerHeaderStore = create<ResellerHeaderStore>(
	(set, _get) => ({
	company: emptyCompany,
    reseller_header: emptyHeader,
	setCompany: (company:any)=> set((state)=> ({...state, company: company})),
    setResellerHeader: (header:any)=> set((state)=> ({...state, reseller_header: header})),
}));

export default useResellerHeaderStore;
