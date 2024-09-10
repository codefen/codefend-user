import { create } from 'zustand';

export interface SelectMobileCloudApp {
  appSelected: any | null;
  newApp: any | null;
  setNewApp: (app: any) => void;
  setAppSelected: (app: any) => void;
}

export const useSelectedAppStore = create<SelectMobileCloudApp>((set, _get) => ({
  appSelected: null,
  newApp: null,
  setNewApp: (app: any) => set({ newApp: app }),
  setAppSelected: (app: any) => set({ appSelected: app }),
}));
