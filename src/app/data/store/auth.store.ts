import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { type User } from '..';
import { EMPTY_USER } from '@/app/constants/empty';
import type { StateInitializer } from '@interfaces/store';

export interface AuthState {
  userData: User;
  isAuth: boolean;
  accessToken: string;

  logout: () => void;
  updateAuth: () => void;
  updateToken: (updatedToken: string) => void;
  updateUser: (user: User) => void;
}

/**
 * These are two middleware that wrap the store.
 * - devtools allows using react devtools with zustand
 * - persist, adds data persistence/cache using local storage (Can be configured to use another system)
 *
 * @param store        Store that will be wrapped
 * @param persistence  Name / Identifier of the store in persistence
 */
const stateInitV2: StateInitializer<AuthState> = (store, persistence) =>
  devtools(persist(store, persistence));

const useAuthStore = create<AuthState>()(
  stateInitV2(
    (set: any, _get: any) => ({
      userData: EMPTY_USER,
      isAuth: false,
      accessToken: '',
      logout: () => set({ userData: EMPTY_USER, isAuth: false, accessToken: '' }),
      updateAuth: () => {
        const state = _get() as AuthState;
        const currentTimestamp = Math.floor(Date.now() / 1000);

        const updatedAuth =
          state.userData &&
          Object.keys(state.userData).length > 0 &&
          (state.accessToken?.trim() ?? '') !== '' &&
          !(currentTimestamp >= state.userData.exp!);

        console.log({ updatedAuth });
        set((current: AuthState) => ({ ...current, isAuth: updatedAuth }));
      },
      updateToken: (updatedToken: string) =>
        set((prev: AuthState) => ({ ...prev, accessToken: updatedToken })),
      updateUser: (user: User) => set((prev: AuthState) => ({ ...prev, userData: user })),
    }),
    {
      name: 'authStore',
    }
  )
);

export default useAuthStore;
