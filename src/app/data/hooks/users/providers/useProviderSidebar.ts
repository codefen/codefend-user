import { useLocation } from 'react-router';
import { useProviderSidebarStore } from '../../../store/provider.store';
import { useEffect } from 'react';

export enum ProviderSidebarOptions {
  ABOUT,
  ORDERS,
  EXPERIENCES,
  EDUCATION,
}

export const useProviderSidebar = () => {
  const location = useLocation();
  const { setActiveOption, setActiveSubOption, activeOption, activeSubOption } =
    useProviderSidebarStore(state => state);

  useEffect(() => {
    const active = location.pathname.split('/')[2];
    setActiveOption(active);
    setActiveSubOption(0);
  }, [location]);

  return { activeOption, activeSubOption, setActiveSubOption } as const;
};
