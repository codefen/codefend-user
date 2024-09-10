import { create, type StoreApi, type UseBoundStore } from 'zustand';

export enum CredentialPage {
  ADD,
  VIEW,
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
  credential: any;
  setCrendentialType: (type: string) => void;
  setResourceId: (resourceId: string) => void;
  setActivePage: (page: CredentialPage) => void;
  setViewMore: (open: ViewMore) => void;
  setCredential: (cred: any) => void;
}

const useCredentialStore: UseBoundStore<StoreApi<CredentialStore>> = create<CredentialStore>(
  set => ({
    type: '',
    resourceId: '',
    activePage: CredentialPage.ADD,
    viewMore: { open: false, id: '' },
    credential: null,
    setCrendentialType: type => set({ type }),
    setResourceId: resourceId => set({ resourceId }),
    setActivePage: page => set({ activePage: page }),
    setViewMore: open => set({ viewMore: open }),
    setCredential: cred => set({ credential: cred }),
  })
);

export default useCredentialStore;
