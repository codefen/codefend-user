import { type FC } from 'react';
import { AdminCompanyPanel } from './components/AdminCompanyPanel';
import AdminCompanyDetails from './components/AdminCompanyDetails';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';

const AdminCompany: FC = () => {
  const [showScreen] = useShowScreen();
  const { logout, getUserdata, isAuth } = useUserData();
  const isNotAuthenticated = !getUserdata() || !isAuth;
  if (isNotAuthenticated) {
    logout();
  }
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
