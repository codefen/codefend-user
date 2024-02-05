import { Mutate, StateCreator, StoreApi, create } from 'zustand';

import { devtools, persist } from 'zustand/middleware';
import { AuthServices, User } from '..';
import { StateImpl, StateMiddleware } from './utils';

export interface AuthState {
	user: User;
	isAuth: boolean;
	accessToken: string;
	errors: any;

	login: (loginParams: any) => Promise<void>;
	register: (registerParams: any) => Promise<void>;
	registerFinish: (finishParams: any) => Promise<void>;
	logout: () => void;
	clearErrors: () => void;
}

const authMiddleware: StateMiddleware =
	(f, bar) => (set: any, get: any, _store: any) => {
		type T = ReturnType<typeof f>;
		type A = typeof bar;

		const store = _store as Mutate<StoreApi<T>, [['state', A]]>;
		store.state = bar;
		console.log({ store });
		console.log({ bar });

		return f(set, get, store);
	};

export const stateInit = authMiddleware as unknown as StateImpl;

const stateInitV2 = (store: any, name: string) =>
	devtools(persist(store, { name })) as StateCreator<
		AuthState,
		[],
		[['zustand/persist', string]]
	>;

const useAuthStore = create<AuthState>()(
	stateInitV2(
		(set: any, _get: any) => ({
			user: {} as User,
			isAuth: false,
			accessToken: '',
			errors: null,
			login: async (loginParams: any) => {
				try {
					const { user, token, response, message } = await AuthServices.login(loginParams);
					if (response !== 'success') throw new Error(message);
					if (!user) throw new Error('An unexpected error has ocurred');
					set((prev: AuthState) => ({
						...prev,
						user,
						accessToken: token,
						isAuth: true,
					}));
					return true;
				} catch {
					return false;
				}
			},
			register: async (registroParams: any) => {
				try {
					const response = await AuthServices.register(registroParams);
					const registerResponse = response.data;

					if (registerResponse.response !== 'success') {
						throw new Error(registerResponse.error);
					}

					console.log(registerResponse);

					return registerResponse;
				} catch (error: any) {
					set(() => ({ errors: error.response.data }));
				}
			},
			registerFinish: async (finishParams: any) => {
				try {
					const response = await AuthServices.registerFinish(finishParams);
					const finishResponse = response;

					if (finishResponse.response !== 'success') {
						throw new Error(finishResponse.message);
					}

					return finishResponse;
				} catch (error: any) {
					set(() => ({ errors: error.response.data }));
				}
			},
			logout: () => set({ user: null, isAuth: false, accessToken: '' }),
			clearErrors: () => set({errors: null})
		}),
		'authState',
	),
);

export default useAuthStore