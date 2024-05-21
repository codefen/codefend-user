import { create } from 'zustand';

export interface TableV3Store {
	selectedItems: any[];
    disableOnChange: boolean;
	setSelectedItems: (data: any) => void;
	removeItem: (id: string) => void;
	cleanSelected: () => void;
    setAll: (data: any[]) => void;
    setDisableOnChange: (val:boolean)=>void;
}

const useTableStoreV3 = create<TableV3Store>((set) => ({
	selectedItems: [],
    disableOnChange: false,
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
    setDisableOnChange: (val:boolean) => set(({ disableOnChange: val })),
}));

export default useTableStoreV3;
