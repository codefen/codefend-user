import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';
import { ScanTitle } from '@/app/views/pages/panel/layouts/scans/ScanTitle/ScanTitle';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { useEffect } from 'react';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();
  const globalStore = useGlobalFastFields([
    'isScanning',
    'company',
    'scanRetries',
    'appEvent',
    'userLoggingState',
  ]);

  useEffect(() => {
    if (
      !globalStore.isScanning.get &&
      globalStore.appEvent.get !== APP_EVENT_TYPE.SCAN_PAGE_CONDITION &&
      globalStore.userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT
    ) {
      globalStore.scanRetries.set(3);
      globalStore.appEvent.set(APP_EVENT_TYPE.SCAN_PAGE_CONDITION);
    }
  }, [globalStore.isScanning, globalStore.appEvent.get]);

  return (
    <main className={`scans ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ScanSection />
      </section>
      <section className="right">
        <ScanTitle />
        <div className="card remaining-searches black-box">
          Available: {globalStore.company.get.disponibles_neuroscan}
        </div>
      </section>
    </main>
  );
};
