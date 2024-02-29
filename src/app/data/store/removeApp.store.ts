import { create } from 'zustand';
import { CloudService, MobileService } from '..';
import { toast } from 'react-toastify';

export interface RemoveAppStore {
    isOpen: boolean;
    isMobileType: boolean;
    isDetails: boolean;
    isImage: boolean;
    appName: string;
    id: string;
    setData: (id:string, appName:string)=>void;
    setIsOpen: (updated: boolean)=> void;
    setIsMobileType: (updated: boolean)=> void;
    setIsDetails: (updated: boolean)=> void;
    setIsImage: (updated: boolean)=> void;
    handleDelete: ( companyID: string)=> Promise<any>;
}

export const useRemoveAppStore = create<RemoveAppStore>((set, _get)=>({
    isOpen: false,
    isMobileType: false,
    isDetails: false,
    isImage: false,
    appName: "",
    id: "",
    setData: (id:string, appName:string)=> set((prev)=>({...prev, appName, id})),
    setIsOpen: (updated: boolean)=> set((prev)=> ({...prev, isOpen: updated})),
    setIsMobileType: (updated: boolean)=> set((prev)=> ({...prev, isMobileType: updated})),
    setIsDetails: (updated: boolean)=> set((prev)=> ({...prev, isDetails: updated})),
    setIsImage: (updated: boolean)=> set((prev)=> ({...prev, isImage: updated})),
    handleDelete: (companyID: string)=>{
        const state = _get();
        const DeleteService = state.isMobileType ? MobileService : CloudService;

        return DeleteService.deleteApp(state.id, companyID)
				.then(() => {
					toast.success(
						`successfully deleted ${
							state.isMobileType ? 'mobile app' : 'cloud'
						} `,
					);
				})
				.catch(() => {
					toast.error('An unexpected error has occurred on the server');
				});
    }
}));

