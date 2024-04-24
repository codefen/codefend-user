import { create } from 'zustand';

export interface CredentialStore {
    type: string;
    resourceId: string;
    setCrendentialType: (type: string) => void;
    setResourceId: (resourceId: string) => void;
}

const useCredentialStore = create<CredentialStore>((set) => ({
	type: '',
    resourceId: "",
	setCrendentialType: (type) => set({ type }),
    setResourceId: (resourceId) => set({ resourceId })  
}));

export default useCredentialStore;
