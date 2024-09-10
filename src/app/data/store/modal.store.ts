import { create } from 'zustand';

export interface ModalStore {
  isOpen: boolean;
  modalId: string;
  setModalId: (state: string) => void;
  setIsOpen: (state: boolean) => void;
}

const useModalStore = create<ModalStore>(set => ({
  isOpen: false,
  modalId: '',
  setModalId: state => set({ modalId: state }),
  setIsOpen: state => set({ isOpen: state }),
}));

export default useModalStore;
