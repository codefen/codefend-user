import { useLocation } from 'react-router';
import { create } from 'zustand';

interface IState {
	open: boolean; 
	handleChange: () => void; 
	isActivePath: (verifyPath: string, isRoot?: boolean) => 'active' | boolean;
}

const usePanelStore = create<IState>((set) => ({
	open: false, 
	handleChange: () => set((state) => ({ open: !state.open })),
	isActivePath: (verifyPath: string, isRoot?: boolean) => {
		const location = useLocation();
		const currentPath = location.pathname;
		if (currentPath === '/' && isRoot) return true;
		return currentPath.startsWith(verifyPath);
	},
}));

export default usePanelStore