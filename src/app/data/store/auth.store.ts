import { type StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
	type User,
	decodePayload,
} from '..';
import { AxiosHttpService } from '../services/axiosHTTP.service';
import { EMPTY_USER } from '@/app/constants/empty';

export interface AuthState {
	userData: User;
	isAuth: boolean;
	accessToken: string;

	login: (loginParams: any) => Promise<any>;
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
const stateInitV2 = (store: any, persistence: any) =>
	devtools(persist(store, persistence)) as StateCreator<
		AuthState,
		[],
		[['zustand/persist', string]]
	>;

const useAuthStore = create<AuthState>()(
	stateInitV2(
		(set: any, _get: any) => ({
			userData: EMPTY_USER,
			isAuth: false,
			accessToken: '',
			login: (loginParams: any) => {
				const fetchcer = AxiosHttpService.getInstance();
				return fetchcer
					.post<any>({
						body: {
							provided_password: loginParams.password,
							provided_email: loginParams.email,
							model: 'users/access',
						},
					})
					.then(({ data }: any) => {
						if (data.response !== 'success')
							throw new Error(data.info);
						if (!data.user)
							throw new Error('An unexpected error has ocurred');

						const token = data.session as string;
						const decodedToken = decodePayload(token || "");
						const user ={
							...data.user,
							exp: decodedToken?.exp || 0,
						};
						set((prev: AuthState) => ({
							...prev,
							userData: user,
							accessToken: token,
							isAuth: true,
						}));
						return { user, error: false };
					})
					.catch((e) => ({ error: true, info: e.message }));
			},
			logout: () => set({ userData: EMPTY_USER, isAuth: false, accessToken: '' }),
			updateAuth: () => {
				const state = _get() as AuthState;
				const currentTimestamp = Math.floor(Date.now() / 1000);
				
				const updatedAuth = state.userData &&
					Object.keys(state.userData).length > 0 &&
					(state.accessToken?.trim() ?? '') !== '' &&
					!(currentTimestamp >= state.userData.exp!);

				set((current: AuthState) => ({ ...current, isAuth: updatedAuth }));
			},
			updateToken: (updatedToken: string) =>
				set((prev: AuthState) => ({ ...prev, accessToken: updatedToken })),
			updateUser: (user: User) =>
				set((prev: AuthState) => ({ ...prev, userData: user })),
		}),
		{
			name: 'authStore',
		},
	),
);

export default useAuthStore;
