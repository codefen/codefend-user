import { create } from 'zustand';
import { CloudApp, CloudService, MobileApp, MobileService, MobileUnique, mobileUniqueProps } from '..';
import { toast } from 'react-toastify';

export interface RemoveAppStore {
    isOpen: boolean;
    isMobileType: boolean;
    appName: string;
    id: string;
    setData: (id:string, appName:string)=>void;
    setIsOpen: (updated: boolean)=> void;
    setIsMobileType: (updated: boolean)=> void;
    handleDelete: ( companyID: string)=> Promise<any>;
}

export const useRemoveAppStore = create<RemoveAppStore>((set, _get)=>({
    isOpen: false,
    isMobileType: false,
    appName: "",
    id: "",
    setData: (id:string, appName:string)=> set((prev)=>({...prev, appName, id})),
    setIsOpen: (updated: boolean)=> set((prev)=> ({...prev, isOpen: updated})),
    setIsMobileType: (updated: boolean)=> set((prev)=> ({...prev, isMobileType: updated})),
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

export interface SelectMobileCloudApp {
    appSelected: MobileApp | CloudApp | null;
    appUnique: MobileUnique | null;
    isNotNull: ()=> boolean;
    isCurrentSelected: (id: string)=> boolean;
    updateSelected: (updated: MobileApp | CloudApp)=> void;
    resetSelectedApp: ()=> void;
    fetchMobileOne: () => Promise<any>;
}

export const useSelectMobileCloudApp = create<SelectMobileCloudApp>((set, _get)=>({
    appSelected: null,
    appUnique: null,
    isNotNull: ()=>{
        const state = _get();
        return state.appSelected !== null && state.appSelected !== undefined;
    },
    isCurrentSelected: (id: string)=>{
        const state = _get();
        return state.isNotNull() && state.appSelected?.id === id; 
    },
    updateSelected: (updated: MobileApp | CloudApp)=>{
        const state = _get();
        if (updated && !state.isCurrentSelected(updated.id)) {
			set((prev)=>({...prev, appSelected: updated}));
		}
    },
    resetSelectedApp: ()=>
        set((prev)=> ({...prev, appSelected: null})),

    fetchMobileOne: async ()=> {
        const {appSelected} = _get();

        return MobileService.getMobileByID(appSelected?.id || "", appSelected?.companyID || "")
        .then((response) => {
            set((prev: SelectMobileCloudApp)=> ({...prev, appUnique: mobileUniqueProps(response)}))
        })
        .catch((error: any) => {
            console.error(error);
        });
    }
}))