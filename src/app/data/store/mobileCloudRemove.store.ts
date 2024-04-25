import { create } from 'zustand';
import { toast } from 'react-toastify';
import { AxiosHttpService } from '../services/axiosHTTP.service';

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
					model: `resources/${state.isMobileType ?'mobile':'cloud'}`,
					ac: 'del',
					company_id: companyID,
					id: state.id,
				},
			})
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
	},
}));
