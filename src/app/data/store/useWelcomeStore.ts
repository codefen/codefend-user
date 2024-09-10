import { create } from 'zustand';

export interface WelcomeStore {
  openModal: boolean;
  openGuide: boolean;
  openFirstResource: boolean;
  setOpenModal: (app: boolean) => void;
  setOpenGuide: (app: boolean) => void;
  setOpenFirstResource: (app: boolean) => void;
}

export const useWelcomeStore = create<WelcomeStore>((set, _get) => ({
  openModal: false,
  openGuide: false,
  openFirstResource: false,
  setOpenModal: (app: boolean) => set({ openModal: app }),
  setOpenGuide: (app: boolean) => set({ openGuide: app }),
  setOpenFirstResource: (app: boolean) => set({ openFirstResource: app }),
}));
