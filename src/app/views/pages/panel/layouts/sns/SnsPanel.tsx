import { useEffect, type FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches.tsx';
import SnsCardTitle from './components/SnsCardTitle';
import SnsSearchAndData from './components/SnsSearchAndData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import './Sns.scss';

const SnsPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { previousSearches, isLoading, refetch } = usePreviousSearch('sns');
  const company = useGlobalFastField('company');

  useEffect(() => {
    refetch();
  }, [control]);

  return (
    <>
      <main className={`sb ${showScreen ? 'actived' : ''}`}>
        <section className="left">
          <SnsSearchAndData refetch={refresh} />
        </section>

        <section className="right">
          <SnsCardTitle arrow="none" />
          <div className="card remaining-searches">
            Remaining searches: {company.get.disponibles_sns}
          </div>
          <SnPreviousSearches isLoading={isLoading} previousSearches={previousSearches || []} />
        </section>
      </main>
    </>
  );
};

export default SnsPanel;
