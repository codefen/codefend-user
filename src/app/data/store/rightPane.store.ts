import { useLocation } from 'react-router';
import { create } from 'zustand';

interface IState {
	activePage: number; 
    transition: boolean;
    setActivePage: (page: number) => void;
    setTransition: (transition: boolean) => void;
}

const useRightPaneStore = create<IState>((set) => ({
    activePage: 1,
    transition: false,
    setActivePage: (page) => set({ activePage: page }),
    setTransition: (transition) => set({ transition }),
}));

export default useRightPaneStore;