import { create } from 'zustand';
import { toast } from 'react-toastify';
import { AxiosHttpService } from '../services/axiosHTTP.service';
import { apiErrorValidation } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST, CLOUD_PANEL_TEXT, MOBILE_PANEL_TEXT } from '@/app/constants/app-toast-texts';

export interface RemoveAppStore {
	isOpen: boolean;
	isMobileType: boolean;
	appName: string;
	id: string;
	setData: (id: string, appName: string) => void;
	setIsOpen: (updated: boolean) => void;
	setIsMobileType: (updated: boolean) => void;
	handleDelete: (companyID: string) => Promise<any>;
}

export const useRemoveAppStore = create<RemoveAppStore>((set, _get) => ({
	isOpen: false,
	isMobileType: false,
	appName: '',
	id: '',
	setData: (id: string, appName: string) =>
		set((prev) => ({ ...prev, appName, id })),
	setIsOpen: (updated: boolean) =>
		set((prev) => ({ ...prev, isOpen: updated })),
	setIsMobileType: (updated: boolean) =>
		set((prev) => ({ ...prev, isMobileType: updated })),
	handleDelete: (companyID: string) => {
		const state = _get();
		const fetchcer = AxiosHttpService.getInstance();
		return fetchcer
			.post({
				body: {
					model: `resources/${state.isMobileType ? 'mobile' : 'cloud'}`,
					ac: 'del',
					company_id: companyID,
					id: state.id,
				},
			})
			.then(({ data }: any) => {
				if (apiErrorValidation(data?.error, data?.response)) {
					throw new Error(APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
				}
				toast.success(
					state.isMobileType
						? MOBILE_PANEL_TEXT.DELETED_MOBILE
						: CLOUD_PANEL_TEXT.DELETED_CLOUD,
				);
			})
			.catch((e: Error) => {
				toast.error(e.message);
			});
	},
}));
