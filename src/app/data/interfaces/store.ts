import type { StateCreator } from 'zustand';

export type ZustandMutators<T> = Array<
  ['zustand/devtools' | 'zustand/persist', unknown | T | never]
>;

export type StateInitializer<T> = (
  store: StateCreator<T, Array<any>, ZustandMutators<T>>,
  persistence: { name: string }
) => StateCreator<T, any[], ZustandMutators<T>>;
