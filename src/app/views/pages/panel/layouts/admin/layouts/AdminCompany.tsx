import { useEffect, type FC } from 'react';
import { AdminCompanyPanel } from './components/AdminCompanyPanel';
import AdminCompanyDetails from './components/AdminCompanyDetails';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';

const AdminCompany: FC = () => {
  const [showScreen] = useShowScreen();
  const { logout, getUserdata, isAuth } = useUserData();
  const { appEvent, userLoggingState } = useGlobalFastFields(['appEvent', 'userLoggingState']);

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
      <main className={`company ${showScreen ? 'actived' : ''}`}>
        <section className="left">
          <AdminCompanyPanel />
        </section>
        {/*        <section className="right">
          <AdminCompanyDetails />
        </section> */}
      </main>
    </>
  );
};

export default AdminCompany;
