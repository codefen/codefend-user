import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useEffect, useState } from 'react';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';

// Variable global para bloquear llamadas incorrectas
const getScannerStarting = () => {
  return (window as any).SCANNER_STARTING ? (window as any).SCANNER_STARTING() : false;
};

const getInProgress = (scans: any[]) =>
  scans.filter(s => s.phase === 'scanner' || s.phase === 'parser');

export const useScanDashboardView = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const [scanDashboardView, setScanDashboardView] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, modalId } = useModalStore();

  useEffect(() => {
    // PROTECCIÓN SELECTIVA: Solo bloquear durante el onboarding del scanner
    // No bloquear usos legítimos de neuroscans/index
    if (isOpen && modalId === MODAL_KEY_OPEN.USER_WELCOME_FINISH && getScannerStarting()) {
      console.log('🚫 BLOQUEANDO useScanDashboardView - Onboarding scanner en proceso');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetcher<any>('post', {
      body: {
        company_id: getCompany(),
      },
      path: 'neuroscans/index',
      requireSession: true,
    })
      .then(({ data }) => {
        const scans = data?.neuroscans;
        const latestScans = scans?.sort?.((a: any, b: any) => b?.id - a?.id)?.slice?.(0, 3);
        setScanDashboardView(latestScans || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, modalId]);

  return {
    scanDashboardView,
    isLoading,
  };
};
