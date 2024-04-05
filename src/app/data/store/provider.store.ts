import type { Provider } from '@interfaces/provider';
import { create } from 'zustand';






export interface ProviderProfileStore {
	provider?: Provider;
	loginSequence?: string;
	setProvider: (updated: Provider) => void;
	setLogicSequence: (updated: string) => void;
}

export const useProviderProfileStore = create<ProviderProfileStore>(
	(set, _get) => ({
		provider: undefined,
		loginSequence: undefined,
		setProvider: (updated: Provider) => {
			set((prev: ProviderProfileStore) => ({
				...prev,
				provider: {
					...updated,
					id_verified: updated?.id_verified == "1",
				},
			}));
		},
		setLogicSequence: (updated: string) => {
			set((prev: ProviderProfileStore) => ({
				...prev,
				loginSequence: updated,
			}));
		},
	}),
);

export interface ProviderSidebarStore {
	activeOption?: string;
	activeSubOption?: number;
	setActiveOption: (updated: string) => void;
	setActiveSubOption: (updated: number) => void;
}

export const useProviderSidebarStore = create<ProviderSidebarStore>(
	(set, _get) => ({
		activeOption: undefined,
		activeSubOption: undefined,
		setActiveOption: (updated: string) => {
			set((prev: ProviderSidebarStore) => ({
				...prev,
				activeOption: updated,
			}));
		},
		setActiveSubOption: (updated: number) => {
			set((prev: ProviderSidebarStore) => ({
				...prev,
				activeSubOption: updated,
			}));
		},
	}),
);
