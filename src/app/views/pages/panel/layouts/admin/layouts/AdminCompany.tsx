import { useEffect, type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { Navbar } from '@/app/views/components';
import CompanyIndexView from '@/app/views/pages/panel/layouts/admin/layouts/components/CompanyIndexView';
import { DeleteNeuroscans } from '@/app/views/pages/panel/layouts/admin/components/DeleteNeuroscans';
import { CreateCompany } from '@/app/views/pages/panel/layouts/admin/components/CreateCompany';

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
          <CompanyIndexView />
        </section>
        <section className="right">
          <Navbar />
          <DeleteNeuroscans />
          <CreateCompany />
        </section>
      </main>
    </>
  );
};

export default AdminCompany;
