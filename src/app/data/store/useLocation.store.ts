import type { StateInitializer } from '@interfaces/store';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface IState {
  country: string;
  city: string;
  region: string;
  setData: (data: Omit<IState, 'setData'>) => void;
}

/**
 * These are two middleware that wrap the store.
 * - devtools allows using react devtools with zustand
 * - persist, adds data persistence/cache using local storage (Can be configured to use another system)
 * @param store        Store that will be wrapped
 * @param persistence  Name / Identifier of the store in persistence
 */
const stateInitV2: StateInitializer<IState> = (store, persistence) =>
  devtools(persist(store, persistence));

export const useUserLocationStore = create<IState>()(
  stateInitV2(
    (set: any, _get: any) => ({
      country: '',
      city: '',
      region: '',
      setData: ({ city, country, region }) => set({ city, country, region }),
    }),
    {
      name: 'userLocation',
    }
  )
);
