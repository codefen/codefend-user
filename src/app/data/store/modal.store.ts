import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { create } from 'zustand';

export interface ModalStore {
  isOpen: boolean;
  modalId: string;
  setModalId: (state: string) => void;
  setIsOpen: (state: boolean) => void;
}

const useModalStore = create<ModalStore>(set => ({
  isOpen: true,
  modalId: MODAL_KEY_OPEN.USER_WELCOME_FINISH,
  setModalId: state => set({ modalId: state }),
  setIsOpen: state => set({ isOpen: state }),
}));

export default useModalStore;
