import { type FC } from 'react';
import { VdbPreviousSearches } from './components/VdbPreviousSearches.tsx';
import { VdbSearchData } from './components/VdbSearchData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './vdb.scss';

const VdbPanel: FC = () => {
  const [showScreen] = useShowScreen();
  return (
    <>
      <main className={`sb ${showScreen ? 'actived' : ''}`}>
        <section className="left">
          <VdbSearchData />
        </section>
        <section className="right">
          <VdbPreviousSearches />
        </section>
      </main>
    </>
  );
};

export default VdbPanel;
