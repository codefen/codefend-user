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
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel.ts';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

const SnsPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { previousSearches, isLoading, refetch } = usePreviousSearch('sns');
  const { company, appEvent, userLoggingState } = useGlobalFastFields([
    'company',
    'appEvent',
    'userLoggingState',
  ]);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.DATALEAK_PAGE_CONDITION);
    }
  }, [control]);

  return (
    <>
      <main className={`sb ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        <section className="left">
          {/* Cards móviles - se muestran solo en móvil */}
          <div className="mobile-cards">
            {/* Card de bienvenida */}
            <SnsCardTitle
              arrow="none"
              title="Dataleaks search"
              description="Protect your brand.Check our data breach databases to find out if your users or business information has been exposed."
            />
          </div>

          <SnsSearchAndData refetch={refresh} />

          {/* Badge "Remaining searches" - se muestra solo en móvil */}
          <div className="mobile-bottom-card">
            <div className="card remaining-searches">
              Remaining searches: {company.get.disponibles_sns}
            </div>
          </div>
        </section>

        <section className="right">
          <Navbar />
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
