import { create } from 'zustand';

export enum CredentialPage {
    ADD,
    VIEW
}

interface ViewMore {
    id: string;
    open: boolean;
}

export interface CredentialStore {
    type: string;
    resourceId: string;
    activePage: CredentialPage;
    viewMore: ViewMore;
    setCrendentialType: (type: string) => void;
    setResourceId: (resourceId: string) => void;
    setActivePage: (page: CredentialPage) => void;
    setViewMore: (open: ViewMore) => void;
}

const useCredentialStore = create<CredentialStore>((set) => ({
	type: '',
    resourceId: "",
    activePage: CredentialPage.ADD,
    viewMore: {open: false, id: ""},
	setCrendentialType: (type) => set({ type }),
    setResourceId: (resourceId) => set({ resourceId }),
    setActivePage: (page) => set({ activePage: page }),
    setViewMore: (open) => set({ viewMore: open })
}));

export default useCredentialStore;
