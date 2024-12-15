import type { Update } from '@tauri-apps/plugin-updater';
import { create } from 'zustand';

interface UpdatingState {
  has: boolean;
  accept: boolean;
  reject: boolean;
  update?: Update;
  setHas: (has: boolean) => void;
  setAccept: (accept: boolean) => void;
  setReject: (reject: boolean) => void;
  setUpdate: (update: Update) => void;
}

const useUploadingStore = create<UpdatingState>(set => ({
  has: false,
  accept: false,
  reject: false,
  setHas: (has: boolean) => set({ has }),
  setAccept: (accept: boolean) => set({ accept }),
  setReject: (reject: boolean) => set({ reject }),
  setUpdate: (update: Update) => set({ update }),
}));

export { useUploadingStore };
