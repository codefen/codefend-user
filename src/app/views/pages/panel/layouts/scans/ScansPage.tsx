import { useShowScreen } from '#commonHooks/useShowScreen';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();
  const scanRetries = useGlobalFastField('scanRetries');

  useEffect(() => {
    scanRetries.set(1);
  }, []);

  return (
    <main className={`scans ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ScanSection />
      </section>
    </main>
  );
};
