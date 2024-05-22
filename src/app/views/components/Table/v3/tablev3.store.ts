import { create } from 'zustand';

export interface TableV3Store {
	selectedItems: any[];
	setSelectedItems: (data: any) => void;
	removeItem: (id: string) => void;
	cleanSelected: () => void;
    setAll: (data: any[]) => void;
}

const useTableStoreV3 = create<TableV3Store>((set) => ({
	selectedItems: [],
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
}));

export default useTableStoreV3;
