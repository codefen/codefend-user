import { StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthServices, User } from '..';

export interface AuthState {
	userData: User;
	isAuth: boolean;
	accessToken: string;

	login: (loginParams: any) => Promise<any>;
	register: (registerParams: any) => Promise<any>;
	registerFinish: (finishParams: any) => Promise<any>;
	logout: () => void;
	updateAuth:()=>void;
	updateToken:(updatedToken: string)=>void;
}

const stateInitV2 = (store: any, persistence: any) =>
	devtools(persist(store, persistence)) as StateCreator<
		AuthState,
		[],
		[['zustand/persist', string]]
	>;

const useAuthStore = create<AuthState>()(
	stateInitV2(
		(set: any, _get: any) => ({
				userData: {} as User,
				isAuth: false,
				accessToken: '',
			login: (loginParams: any) => {
					return AuthServices.login(loginParams).then(({ user, token, response, message })=>{
						if (response !== 'success') throw new Error(message);
						if (!user) throw new Error("An unexpected error has ocurred");
						set((prev: AuthState)=>({...prev, userData: user, accessToken: token, isAuth: true}));
						return ({error:false});
					 }).catch((error: Error)=> ({error: true, message: error.message, type: error.name}));
			},
			logout: () => set({ user: null, isAuth: false, accessToken: '' }),
			register: (registroParams: any) => {
				return AuthServices.register(registroParams).then(({data})=>{
					if (data.response !== 'success') {
						throw new Error(data.error);
					}
					return ({error: false, ...data});
				}).catch((error:Error)=>({error: true, message: error.message}));
			},
			registerFinish: (finishParams: any) => {
				 return AuthServices.register(finishParams).then((data:any)=>{
					if (data.response !== 'success') {
						throw new Error(data.error);
					}
					return ({error: false, ...data});
				}).catch((error:Error)=>({error: true, message: error.message}));
			},
			updateAuth:()=> {
				const state = _get() as AuthState;
				const currentTimestamp = Math.floor(Date.now() / 1000);
					const updatedAuth: boolean =
					(Object.keys(state.userData).length > 0) && 
					((state.accessToken?.trim() ?? "") !== "") && 
					!(currentTimestamp >= state.userData.exp!);

				set((current: AuthState)=>({...current, isAuth: updatedAuth}));
			},
			updateToken:(updatedToken: string)=> set((prev: AuthState)=>({...prev,  accessToken: updatedToken}))
		}),
		{
		
			name: 'authStore'
		},
	));

export default useAuthStore;
