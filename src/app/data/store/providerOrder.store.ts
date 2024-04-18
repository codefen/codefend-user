import type { Provider } from '@interfaces/provider';
import { create } from 'zustand';

export interface ProviderProfileStore {
	orderId: string;
	openRefuse: boolean;
	openReasonReject: boolean;
    isRefusing: boolean;
    setOrderId: (orderId: string) => void;
    setClickRefuse: (openRefuse: boolean) => void;
    setOpenReasonReject: (openReasonReject: boolean) => void;
    allClose: () => void;
    setIsRefusing: (isRefusing: boolean) => void;
}

export const useProviderRefuseStore = create<ProviderProfileStore>(
	(set, _get) => ({
		orderId: "",
		openRefuse: false,
        openReasonReject: false,
        isRefusing: false,
        setOrderId: (orderId: string) => set({ orderId }),
        setClickRefuse: (openRefuse: boolean) => set({ openRefuse, openReasonReject: false, }),
        setOpenReasonReject: (openReasonReject: boolean) => set({ openRefuse: false, openReasonReject }),
        allClose: () => set({ openRefuse: false, openReasonReject: false }),
        setIsRefusing: (isRefusing: boolean) => set({ isRefusing }),
	}),
);