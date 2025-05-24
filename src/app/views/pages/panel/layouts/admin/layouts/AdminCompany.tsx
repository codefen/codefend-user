import { useEffect, type FC } from 'react';
import { AdminCompanyPanel } from './components/AdminCompanyPanel';
import AdminCompanyDetails from './components/AdminCompanyDetails';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@interfaces/panel';

const AdminCompany: FC = () => {
  const [showScreen] = useShowScreen();
  const { logout, getUserdata, isAuth } = useUserData();
  const { appEvent } = useGlobalFastFields(['appEvent']);

  useEffect(() => {
    const isNotAuthenticated = !getUserdata() || !isAuth;
    if (isNotAuthenticated) {
      logout();
    }
    if (appEvent.get !== APP_EVENT_TYPE.USER_LOGGED_OUT) {
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
