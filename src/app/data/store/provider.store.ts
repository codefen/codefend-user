import { create } from 'zustand';

/* 
    "provider": {
        "id": "76",
        "company_id": "1",
        "company_access_ids": "124,123",
        "fname": "Christian",
        "lname": "Russo",
        "username": "ch",
        "role": "developer",
        "access_role": "hacker",
        "email": "ch@codefend.com",
        "phone": "5491139393710",
        "password": "943ca65b750465a038457424b4d708c9af21201ffd6d043bdc9e5dbfa0dd9a37",
        "mfa_llave": "disabled",
        "profile_media": "\/9j\/4AAQSkZJRgABAQAAAQABAAD\/","
        "pais": "",
        "pais_code": "",
        "pais_provincia": "",
        "pais_ciudad": "",
        "eliminado": "0",
        "creacion": "2024-03-08 07:38:24",
        "user_id": "76",
        "show_email_and_phone": "0",
        "business_phone": "5491139393710",
        "main_desc": "undefined"
    },
*/

export interface Provider {
	id: string;
	company_id: string;
	company_access_ids: string;
	fname: string;
	lname: string;
	username: string;
	headline: string;
	role: string;
	id_verified: boolean;
	access_role: string;
	email: string;
	phone: string;
	password: string;
	profile_media: string;
	mfa_llave: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
	eliminado: boolean;
	creacion: string;
	user_id: string;
	show_email_and_phone: string;
	business_phone: string;
	main_desc: string;
	finished_orders: number;
	score: number;
	reviews_final: number;
}

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
					id_verified: updated.id_verified as any == 1,
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
