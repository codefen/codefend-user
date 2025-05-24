import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { StateInitializer } from '@interfaces/store';

export interface InitialDomainStore {
  isUniqueDomain: boolean;
  initialDomain: string;
  resourceId: string;
  update: (key: string, value: any) => void;
}

const stateInitV2: StateInitializer<InitialDomainStore> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useInitialDomainStore = create<InitialDomainStore>()(
  stateInitV2(
    (set: any, _get: any) => ({
      initialDomain: '',
      isUniqueDomain: true,
      resourceId: '',
      update: (key: string, value: any) => set({ [key]: value }),
    }),
    {
      name: 'initialDomainStore',
    }
  )
);
