import { create } from 'zustand';

export interface NetworkSettingState {
	isOpen: boolean;
    modalId: string;
	setModalId: (state: string) => void;
	setIsOpen: (state: boolean) => void;
}

const useModalStore = create<NetworkSettingState>((set) => ({
	isOpen: false,
	modalId: '',
    setModalId: (state) => set({ modalId: state }),
    setIsOpen: (state) => set({ isOpen: state }),
}));

export default useModalStore;
