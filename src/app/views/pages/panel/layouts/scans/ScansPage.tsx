import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';
import { ScanTitle } from '@/app/views/pages/panel/layouts/scans/ScanTitle/ScanTitle';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();
  const globalStore = useGlobalFastFields(['isInitialFetchDone', 'isScanning', 'company']);

  useEffect(() => {
    if (!globalStore.isScanning.get) {
      globalStore.isInitialFetchDone.set(true);
    }
  }, [globalStore.isInitialFetchDone.get, globalStore.isScanning]);

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
