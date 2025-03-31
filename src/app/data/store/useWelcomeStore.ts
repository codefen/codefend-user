import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateInitializer } from '@interfaces/store';

type ScanStepType = 'nonScan' | 'scanner' | 'parser' | 'finished';

export interface WelcomeStore {
  initialDomain: string;
  domainId: string;
  isFirstClose: boolean;
  scanStep: ScanStepType;
  isScanRunning: boolean;
  setDomainId: (initialDomain: string) => void;
  saveInitialDomain: (initialDomain: string) => void;
  setFirstClose: (isFirstClose: boolean) => void;
  setScanRunning: (isScanRunning: boolean) => void;
  setScanStep: (scanStep: ScanStepType) => void;
}

const stateInitV2: StateInitializer<WelcomeStore> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useWelcomeStore = create<WelcomeStore>()(
  stateInitV2(
    (set: any, _get: any) => ({
      initialDomain: '',
      isFirstClose: true,
      scanStep: 'nonScan',
      isScanRunning: false,
      domainId: '',
      saveInitialDomain: (initialDomain: string) => set({ initialDomain }),
      setDomainId: (domainId: string) => set({ domainId }),
      setFirstClose: (isFirstClose: boolean) => set({ isFirstClose }),
      setScanRunning: (isScanRunning: boolean) => set({ isScanRunning }),
      setScanStep: (scanStep: ScanStepType) => set({ scanStep }),
    }),
    {
      name: 'welcomeUserStore',
    }
  )
);
