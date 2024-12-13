import { create } from 'zustand';

export interface NetworkSettingState {
  isOpen: boolean;
  toggleNetworkSettingState: () => void;
  setNetworkSettingState: (state: boolean) => void;
}

const useNetworkSettingState = create<NetworkSettingState>(set => ({
  isOpen: false,
  toggleNetworkSettingState: () => {
    set(current => ({ ...current, isOpen: !current.isOpen }));
  },
  setNetworkSettingState: (state: boolean) => {
    set(current => ({ ...current, isOpen: state }));
  },
}));

export default useNetworkSettingState;
