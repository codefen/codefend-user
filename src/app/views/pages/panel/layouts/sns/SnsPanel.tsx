import { useEffect, type FC } from 'react';
import SnPreviousSearches from './components/SnPreviousSearches.tsx';
import SnsCardTitle from './components/SnsCardTitle';
import SnsSearchAndData from './components/SnsSearchAndData.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { usePreviousSearch } from '@moduleHooks/usePreviousSearch.ts';
import {
  useGlobalFastField,
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';
import './Sns.scss';
import { APP_EVENT_TYPE } from '@interfaces/panel.ts';

const SnsPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { previousSearches, isLoading, refetch } = usePreviousSearch('sns');
  const { company, appEvent } = useGlobalFastFields(['company', 'appEvent']);

  useEffect(() => {
    refetch();
  }, [control]);

  useEffect(() => {
    if (appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.DATALEAK_PAGE_CONDITION);
    }
  }, [appEvent.get]);

  return (
    <>
      <main className={`sb ${showScreen ? 'actived' : ''}`}>
        <section className="left">
          <SnsSearchAndData refetch={refresh} />
        </section>

        <section className="right">
          <SnsCardTitle
            arrow="none"
            title="Dataleaks search"
            description="Protect your brand.Check our data breach databases to find out if your users or business information has been exposed."
          />
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
