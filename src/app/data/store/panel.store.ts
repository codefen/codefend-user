import { useLocation } from 'react-router';
import { create } from 'zustand';

interface IState {
	open: boolean; 
	handleChange: () => void; 
	isActivePath: (verifyPath: string) => 'active' | boolean;
}

export const usePanelStore = create<IState>((set) => ({
	open: false, 
	handleChange: () => set((state) => ({ open: !state.open })),
	isActivePath: (verifyPath: string) => {
		const location = useLocation();
		const currentPath = location.pathname;
		if (currentPath === '/' && verifyPath === '/dashboard') return 'active';
		return currentPath.startsWith(verifyPath);
	},
}));
