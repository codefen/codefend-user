import { useEffect, type FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches.tsx';
import SnsCardTitle from './components/SnsCardTitle';
import SnsSearchAndData from './components/SnsSearchAndData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import './Sns.scss';
import './RemainingSearches.scss';

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
          {/* Si no hay búsquedas, mostrar la card centrada */}
          {(!previousSearches || previousSearches.length === 0) && !isLoading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
              }}>
              <SnsCardTitle arrow="up" />
            </div>
          ) : null}
          {/* Cuando hay búsquedas, mostrar arriba (sin flecha ni card si no hay búsquedas) */}
          {previousSearches && previousSearches.length > 0 && !isLoading ? (
            <SnsCardTitle arrow="none" />
          ) : null}
          <div className="remaining-searches-indicator">
            Remaining searches: {company.get.disponibles_sns}
          </div>
          <SnPreviousSearches isLoading={isLoading} previousSearches={previousSearches || []} />
        </section>
      </main>
    </>
  );
};

export default SnsPanel;
