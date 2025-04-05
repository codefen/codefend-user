import { useShowScreen } from '#commonHooks/useShowScreen';
import { ScanSection } from '@/app/views/pages/panel/layouts/scans/ScanSection/ScanSection';

export const ScansPage = () => {
  const [showScreen] = useShowScreen();

  return (
    <main className={`scans ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <ScanSection />
      </section>
    </main>
  );
};
