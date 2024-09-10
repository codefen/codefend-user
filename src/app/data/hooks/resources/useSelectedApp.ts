import { useSelectedAppStore } from '@stores/useSelectedApp.store';

export const useSelectedApp = () => {
  const { appSelected, newApp, setAppSelected, setNewApp } = useSelectedAppStore(state => state);

  const isSelected = (id: string) => appSelected !== null && id === appSelected?.id;

  return { appSelected, newApp, setAppSelected, setNewApp, isSelected } as const;
};
