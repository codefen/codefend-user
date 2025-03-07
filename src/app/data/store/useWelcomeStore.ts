import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateInitializer } from '@interfaces/store';

export interface WelcomeStore {
  initialDomain: string;
  domainId: string;
  isFirstClose: boolean;
  scanStep: number;
  isScanRunning: boolean;
  setDomainId: (initialDomain: string) => void;
  saveInitialDomain: (initialDomain: string) => void;
  setFirstClose: (isFirstClose: boolean) => void;
  setScanRunning: (isScanRunning: boolean) => void;
  setScanStep: (scanStep: boolean) => void;
}

const stateInitV2: StateInitializer<WelcomeStore> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useWelcomeStore = create<WelcomeStore>()(
  stateInitV2(
    (set: any, _get: any) => ({
      initialDomain: '',
      isFirstClose: true,
      scanStep: 1,
      isScanRunning: false,
      domainId: '',
      saveInitialDomain: (initialDomain: string) => set({ initialDomain }),
      setDomainId: (domainId: string) => set({ domainId }),
      setFirstClose: (isFirstClose: boolean) => set({ isFirstClose }),
      setScanRunning: (isScanRunning: boolean) => set({ isScanRunning }),
      setScanStep: (scanStep: boolean) => set({ scanStep }),
    }),
    {
      name: 'welcomeUserStore',
    }
  )
);
