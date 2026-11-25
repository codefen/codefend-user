import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { useEffect } from 'react';
import { InxSearchAndData } from './components/InxSearchAndData.tsx';
import { InxPreviousSearches } from './components/InxPreviousSearches.tsx';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { useFlashlight } from '@/app/views/context/FlashLightContext.tsx';
import './inx.scss';
import Navbar from '@/app/views/components/navbar/Navbar';

const InxPanel = () => {
  const [showScreen, control, _refresh] = useShowScreen();
  const { previousSearches, isLoading, refetch } = usePreviousSearch('inx');
  const flashlight = useFlashlight();

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <PanelInterior title="Intelligence search" ready={showScreen} className="issues-detail">
      <section className="left">
        <InxSearchAndData refetch={refetch} />
      </section>
      <section className="right" ref={flashlight.rightPaneRef}>
        <Navbar />
        <InxPreviousSearches isLoading={isLoading} previousSearches={previousSearches || []} />
      </section>
    </PanelInterior>
  );
};

export default InxPanel;
