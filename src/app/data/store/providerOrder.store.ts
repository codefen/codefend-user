import type { Provider } from '@interfaces/provider';
import { create } from 'zustand';

export interface ProviderProfileStore {
	orderId: string;
	openRefuse: boolean;
	openReasonReject: boolean;
    isRefusing: boolean;
    refuseState: 0 | 1 | 2;
    setOrderId: (orderId: string) => void;
    setClickRefuse: (openRefuse: boolean) => void;
    setOpenReasonReject: (openReasonReject: boolean) => void;
    allClose: () => void;
    setIsRefusing: (isRefusing: boolean) => void;
    setRefuseState: (refuseState: 0 | 1 | 2)=>void;
}

export const useProviderRefuseStore = create<ProviderProfileStore>(
	(set, _get) => ({
		orderId: "",
		openRefuse: false,
        openReasonReject: false,
        isRefusing: false,
        refuseState: 0,
        setOrderId: (orderId: string) => set({ orderId }),
        setClickRefuse: (openRefuse: boolean) => set({ openRefuse, openReasonReject: false, refuseState: 0 as 0}),
        setOpenReasonReject: (openReasonReject: boolean) => set({ openRefuse: false, openReasonReject, refuseState: 1 }),
        allClose: () => set({ openRefuse: false, openReasonReject: false }),
        setIsRefusing: (isRefusing: boolean) => set({ isRefusing }),
        setRefuseState: (refuseState: 0 | 1 | 2)=>set((prev: ProviderProfileStore)=>({...prev, refuseState })),
	}),
);