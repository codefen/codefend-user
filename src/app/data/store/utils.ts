import {
    State,
    StateCreator,
    StoreMutatorIdentifier,
  } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type Write<T extends object, U extends object> = Omit<T, keyof U> & U
export type Cast<T, U> = T extends U ? T : U

export type StateImpl = <
  T extends State,
  A,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, [...Mps, ['state', A]], Mcs>,
  bar: A,
) => StateCreator<T, Mps, [['state', A], ...Mcs]>


declare module 'zustand' {
  interface StoreMutators<S, A> {
    state: Write<Cast<S, object>, { state: A }>
  }
}

export type StateMiddleware = <T extends State, A>(
    f: StateCreator<T, [], []>,
    bar: A,
  ) => StateCreator<T, [], []>