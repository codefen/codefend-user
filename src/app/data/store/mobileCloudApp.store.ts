import { create } from 'zustand';
import {
	type CloudApp,
	type CloudUnique,
	type MobileApp,
	type MobileUnique,
	mapCloudUniqueProps,
	mobileUniqueProps,
} from '..';
import { toast } from 'react-toastify';
import { AxiosHttpService } from '../services/http/axiosHTTP.service';

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

export interface SelectMobileCloudApp {
	appSelected: MobileApp | CloudApp | null;
	appUnique: MobileUnique | CloudUnique | null;
	isNotNull: () => boolean;
	isCurrentSelected: (id: string) => boolean;
	updateSelected: (updated: MobileApp | CloudApp) => void;
	resetSelectedApp: () => void;
	fetchMobileOne: () => Promise<any>;
	fetchCloudOne: () => Promise<any>;
}

export const useSelectMobileCloudApp = create<SelectMobileCloudApp>(
	(set, _get) => ({
		appSelected: null,
		appUnique: null,
		isNotNull: () => {
			const state = _get();
			return state.appSelected !== null && state.appSelected !== undefined;
		},
		isCurrentSelected: (id: string) => {
			const state = _get();
			return state.isNotNull() && state.appSelected?.id === id;
		},
		updateSelected: (updated: MobileApp | CloudApp) => {
			const state = _get();
			if (updated && !state.isCurrentSelected(updated.id)) {
				set((prev) => ({ ...prev, appSelected: updated }));
			}
		},
		resetSelectedApp: () => set((prev) => ({ ...prev, appSelected: null })),

		fetchMobileOne: async () => {
			const { appSelected } = _get();

			const fetchcer = AxiosHttpService.getInstance();
			return fetchcer
				.post({
					body: {
						model: 'resources/mobile',
						ac: 'view_one',
						id: appSelected?.id || '',
						company_id: appSelected?.companyID || '',
					},
				})
				.then((response) => {
					set((prev: SelectMobileCloudApp) => ({
						...prev,
						appUnique: mobileUniqueProps(response),
					}));
				});
		},
		fetchCloudOne: async () => {
			const { appSelected } = _get();

			const fetchcer = AxiosHttpService.getInstance();
			return fetchcer
				.post({
					body: {
						model: 'resources/cloud',
						ac: 'view_one',
						id: appSelected?.id || '',
						company_id: appSelected?.companyID || '',
					},
				})
				.then((res) => {
					set((prev: SelectMobileCloudApp) => ({
						...prev,
						appUnique: mapCloudUniqueProps(res),
					}));
				});
		},
	}),
);
