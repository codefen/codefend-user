import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';
import { ScanTitle } from '@/app/views/pages/panel/layouts/scans/ScanTitle/ScanTitle';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();
  const globalStore = useGlobalFastFields(['scanRetries', 'isScanning', 'company']);

  useEffect(() => {
    if (!globalStore.isScanning) {
      globalStore.scanRetries.set(1);
    }
  }, [globalStore.scanRetries, globalStore.isScanning]);

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
