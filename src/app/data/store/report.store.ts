import { create } from "zustand";

export interface ReportStoreState {
	open: boolean; 
    resourceID: string;
    resourceType: string;

    openModal: ()=>void;
    closeModal: ()=>void;
    setResourceID: (updated:string)=>void;
    setResourceType: (updated:string)=>void;
}

export const useReportStore = create<ReportStoreState>((set, _get) => ({
	open: false, 
    resourceID: "",
    resourceType: "",
	openModal: ()=>
        set((current:any)=>({...current, open: true}))
    ,
    closeModal: ()=>
        set((current:any)=>({...current, open: false}))
    ,
    setResourceID: (updated: string)=> set((current:any)=>({...current, resourceID: updated})),
    setResourceType: (updated: string)=> set((current:any)=>({...current, resourceType: updated}))
}));