import { create } from 'zustand';

interface IState {
	open: boolean; 
	handleChange: () => void; 
}

const usePanelStore = create<IState>((set) => ({
	open: false, 
	handleChange: () => set((state) => ({ open: !state.open }))
}));

export default usePanelStore