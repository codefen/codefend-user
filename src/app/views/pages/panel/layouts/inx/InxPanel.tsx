import { useEffect } from 'react';
import { InxSearchAndData } from './components/InxSearchAndData.tsx';
import { InxPreviousSearches } from './components/InxPreviousSearches.tsx';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useFlashlight } from '@/app/views/context/FlashLightContext.tsx';
import './inx.scss';

const InxPanel = () => {
  const [showScreen, control, _refresh] = useShowScreen();
  const { previousSearches, isLoading, refetch } = usePreviousSearch('inx');
  const flashlight = useFlashlight();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <main className={`issues-detail ${showScreen ? 'actived' : ''}`}>
      <section className="left">
        <InxSearchAndData refetch={refetch} />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <InxPreviousSearches isLoading={isLoading} previousSearches={previousSearches || []} />
      </section>
    </main>
  );
};

export default InxPanel;
