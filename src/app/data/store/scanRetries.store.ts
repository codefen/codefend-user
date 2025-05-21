import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateInitializer } from '@interfaces/store';
import { MAX_SCAN_RETRIES } from '@/app/constants/empty';

export interface ScanRetriesStore {
  scanRetries: number;
  setScanRetries: (scanRetries: number) => void;
}

const stateInitV2: StateInitializer<ScanRetriesStore> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useScanRetriesStore = create<ScanRetriesStore>()(
  stateInitV2(
    (set: any, _get: any) => ({
      scanRetries: MAX_SCAN_RETRIES,
      setScanRetries: (scanRetries: number) => set({ scanRetries }),
    }),
    {
      name: 'scanRetriesStore',
    }
  )
);
