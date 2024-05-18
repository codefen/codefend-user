import { create } from 'zustand';
import {
	type CloudApp,
	type MobileApp,
	mapCloudUniqueProps,
	mobileUniqueProps,
} from '..';
import { AxiosHttpService } from '../services/axiosHTTP.service';

export interface SelectMobileCloudApp {
	appSelected: any;
	appUnique: any | null;
	isCurrentSelected: (id: string) => boolean;
	updateSelected: (updated: any) => void;
	resetSelectedApp: () => void;
	fetchMobileOne: () => Promise<any>;
	fetchCloudOne: () => Promise<any>;
}

const fetchResource = (id: string, companyId: string, type: string) => {
	const fetchcer = AxiosHttpService.getInstance();
			return fetchcer
				.post({
					body: {
						model: `resources/${type}`,
						ac: 'view_one',
						id: id,
						company_id: companyId,
					},
				})
				.then(({data}:any) => {
					return data;
				});
};

export const useSelectMobileCloudApp = create<SelectMobileCloudApp>(
	(set, _get) => ({
		appSelected: null,
		appUnique: null,
		isCurrentSelected: (id: string) => {
			const {appSelected} = _get();
			return Boolean(appSelected) && appSelected?.id === id;
		},
		updateSelected: (updated: any) => {
			const {isCurrentSelected} = _get();
			if (updated && !isCurrentSelected(updated.id)) {
				set((prev) => ({ ...prev, appSelected: updated }));
			}
		},
		resetSelectedApp: () => set((prev) => ({ ...prev, appSelected: null })),

		fetchMobileOne: async () => {
			const { appSelected } = _get();
			return fetchResource(appSelected?.id || '',appSelected?.companyID || '', "mobile").then((data:any) => {
					set((prev: SelectMobileCloudApp) => ({
						...prev,
						appUnique: mobileUniqueProps(data),
					}));
				});
		},
		fetchCloudOne: async () => {
			const { appSelected } = _get();
			return fetchResource(appSelected?.id || '',appSelected?.company_id || '', "cloud").then((data:any) => {
				set((prev: SelectMobileCloudApp) => ({
					...prev,
					appUnique: mapCloudUniqueProps(data),
				}));
			});
		},
	}),
);