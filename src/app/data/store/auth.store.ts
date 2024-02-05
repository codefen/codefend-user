import {
    create,
    State,
    StateCreator,
    StoreMutatorIdentifier,
    Mutate,
    StoreApi,
  } from 'zustand'
  
import { devtools, persist } from 'zustand/middleware'
import { AuthServices, User } from "..";
import { StateImpl, StateMiddleware } from './utils';

export interface AuthState {
    user: User;
    isAuth: boolean;
    accessToken: string;

    login: (loginParams: any) => Promise<void>;
    logout: ()=> void;
}
/*
const authMiddleware: StateMiddleware = (f, bar) => (set: any, get: any, _store: any)=> {

    type T = ReturnType<typeof f>;
    type A = typeof bar;

    const store = _store as Mutate<StoreApi<T>, [['state', A]]>
    store.state = bar
    console.log({ store });
    console.log({ bar });

    return f(set, get, store);
};

export const stateInit = authMiddleware as unknown as StateImpl*/

const stateInitV2 = (store: any, name:string)=> devtools(persist(store, {name})) as StateCreator<AuthState, [], [["zustand/persist", string]]>;

const useAuthStore = create<AuthState>()(
    stateInitV2((set:any, get:any) => ({
        user: {} as User,
        isAuth: false,
        accessToken: "",
        login: (loginParams: any)=> {
                 return AuthServices.login(loginParams).then(({ user, token, response, message })=>{
                    if (response !== 'success') throw new Error(message);
                    if (!user) throw new Error("An unexpected error has ocurred");
                    set((prev: AuthState)=>({...prev, user, accessToken: token, isAuth: true}));
                    return true;
                 }).catch((error: Error)=> ({error: true, message: error.message, type: error.name}));
        },
        logout: ()=>{},
    }), "authState"),
  )