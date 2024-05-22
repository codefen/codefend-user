import { create } from 'zustand';

export interface TableV3Store {
	selectedItems: any[];
	selectingActive: boolean;
	lastSelecting: any;
	setLastSelecting: (data: any) => void;
	setSelectedItems: (data: any) => void;
	removeItem: (id: string) => void;
	cleanSelected: () => void;
    setAll: (data: any[]) => void;
	setActiveSelecting: (bool: boolean) => void;
}

const useTableStoreV3 = create<TableV3Store>((set) => ({
	selectedItems: [],
	selectingActive: false,
	lastSelecting: "",
	cleanSelected: () => set((store: TableV3Store) =>({...store, selectedItems: [] })),
	setSelectedItems: (data) =>
		set(({ selectedItems }: TableV3Store) => ({
			selectedItems:
				selectedItems.length > 0 ? [...selectedItems, data] : [data],
		})),
	removeItem: (id) =>
		set(({ selectedItems }: TableV3Store) => ({
			selectedItems: selectedItems.filter((item: any) => item !== id),
		})),
    setAll: (data) => set({ selectedItems: data }),
	setActiveSelecting: (bool) => set((state: TableV3Store) => ({...state, selectingActive: bool })),
	setLastSelecting: (data) => set({ lastSelecting: data }),
}));

export default useTableStoreV3;
