import { StateCreator, create } from "zustand";
import { IssuesShare, ReportIssues, Webresources } from "..";
import { PersistOptions, devtools, persist } from "zustand/middleware";

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
    resourceType: "web",
	openModal: ()=>
        set((current:any)=>({...current, open: true}))
    ,
    closeModal: ()=>
        set((current:any)=>({...current, open: false}))
    ,
    setResourceID: (updated: string)=> set((current:any)=>({...current, resourceID: updated})),
    setResourceType: (updated: string)=> set((current:any)=>({...current, resourceType: updated}))
}));

export interface ReportInfoStore {
    isLoading: boolean;

    setResources: (updated: Webresources[])=>void;
    setIssues: (updated: ReportIssues[])=>void;
    setIssueShare: (updated: IssuesShare)=>void;
    setIsLoading: (updated: boolean)=>void;

    getResources: ()=>any;
    getIssues: ()=>any;
    getShare: ()=>any;
}
    
export const useReportInfoStore = create<ReportInfoStore>((set, get)=>({
    isLoading: false,

    setResources: (updated: Webresources[])=> localStorage.setItem("report-resource", JSON.stringify(updated)),
    setIssues: (updated: ReportIssues[])=> localStorage.setItem("report-issues", JSON.stringify(updated)),
    setIssueShare: (updated: IssuesShare)=> localStorage.setItem("report-share", JSON.stringify(updated)),
    setIsLoading: (updated: boolean)=> set((prev)=>({...prev, isLoading: updated})),
    getResources: ()=>{
        const resourceStorage = localStorage.getItem("report-resource");
        return resourceStorage ? JSON.parse(resourceStorage) : [];
    },
    getIssues: ()=>{
        const issueStorage = localStorage.getItem("report-issues");
        return issueStorage ? JSON.parse(issueStorage) : [];
    },
    getShare: ()=>{
        const issueShareStore = localStorage.getItem("report-share");
        return issueShareStore ? JSON.parse(issueShareStore) : {};
    }
}));