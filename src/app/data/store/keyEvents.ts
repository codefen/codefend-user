import { create } from 'zustand';

type KeyPress = 'Escape' | 'NONE';

export interface KeyEventStore {
	keyPress: KeyPress;
	setKeyPress: (updated: KeyPress) => void;
}

const useKeyEventPress = create<KeyEventStore>((set) => ({
	keyPress: 'NONE',
	setKeyPress: (updated) => set({ keyPress: updated }),
}));

export default useKeyEventPress;
