import { create } from 'zustand';
import type { TableV3Store } from './types';

export const useTableStoreV3 = create<TableV3Store>(set => ({
  selectedItems: [],
  selectingActive: false,
  lastSelecting: '',
  cleanSelected: () => set((store: TableV3Store) => ({ ...store, selectedItems: [] })),
  setSelectedItems: data =>
    set(({ selectedItems }: TableV3Store) => ({
      selectedItems: selectedItems.length > 0 ? [...selectedItems, data] : [data],
    })),
  removeItem: id =>
    set(({ selectedItems }: TableV3Store) => ({
      selectedItems: selectedItems.filter((item: any) => item !== id),
    })),
  setAll: data => set({ selectedItems: data }),
  setActiveSelecting: bool => set((state: TableV3Store) => ({ ...state, selectingActive: bool })),
  setLastSelecting: data => set({ lastSelecting: data }),
}));
