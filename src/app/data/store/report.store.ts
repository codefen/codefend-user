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
    resourceID: localStorage.getItem("resource-id") ? 
    localStorage.getItem("resource-id")as string : "",
    resourceType: localStorage.getItem("resource-type") ? 
    localStorage.getItem("resource-type")as string : "web",
	openModal: ()=>
        set((current:any)=>({...current, open: true}))
    ,
    closeModal: ()=>{
        set((current:any)=>({...current, open: false}));
        localStorage.removeItem("resource-type");
    }
        
    ,
    setResourceID: (updated: string)=> {
        set((current:any)=>({...current, resourceID: updated}));
        localStorage.setItem("resource-id", updated);
    },
    setResourceType: (updated: string)=> {
        set((current:any)=>({...current, resourceType: updated}));
        localStorage.setItem("resource-type", updated);
    }
}));