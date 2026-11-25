import { PanelInterior } from '@/app/views/pages/panel/layouts/PanelInterior';
import { useEffect, useState, type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { Navbar } from '@/app/views/components';
import CompanyIndexView from '@/app/views/pages/panel/layouts/admin/layouts/components/CompanyIndexView';

import { CreateCompany } from '@/app/views/pages/panel/layouts/admin/components/CreateCompany';
import { CompanyWorldMap } from '@/app/views/components/CompanyWorldMap/CompanyWorldMap';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { useMediaQuery } from 'usehooks-ts';

const AdminCompany: FC = () => {
  const [mapReady, setMapReady] = useState(false);
  const [showScreen] = useShowScreen();
  const { logout, getUserdata, isAuth } = useUserData();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);
  const isDesktop = useMediaQuery('(min-width: 1230px)');
  const { data: companies, isLoading: companiesLoading } = useGetCompany();

  useEffect(() => {
    const isNotAuthenticated = !getUserdata() || !isAuth;
    if (isNotAuthenticated) {
      logout();
    }
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      appEvent.set(APP_EVENT_TYPE.ADMIN_PAGE_CONDITION);
    }
  }, [getUserdata(), isAuth]);

  return (
    <>
      <PanelInterior
        title="Compañías"
        ready={showScreen}
        contentReady={!companiesLoading && mapReady}
        actions={
          <a href="#company-tools" className="company-tools-link">
            Creación y distribución ↓
          </a>
        }
        className={`company admin-company-page ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        <section className="left" aria-label="Directorio de compañías">
          <CompanyIndexView />
        </section>
        <section
          className="right"
          id="company-tools"
          aria-label="Creación y distribución de compañías">
          <Navbar />
          <CreateCompany compact />
          <CompanyWorldMap
            onLoadSettled={setMapReady}
            companies={companies || []}
            title="Distribución geográfica"
            isLoading={companiesLoading}
          />
        </section>
      </PanelInterior>
    </>
  );
};

export default AdminCompany;
