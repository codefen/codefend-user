import { type FC } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import './admin.scss';
import { useUserData } from '#commonUserHooks/useUserData';
import { AdminCompanyPanel } from '@/app/components/AdminCompanyPanel/AdminCompanyPanel';
import AdminCompanyDetails from '@/app/components/AdminCompanyDetails/AdminCompanyDetails';

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
        <section className="right">
          <AdminCompanyDetails />
        </section>
      </main>
    </>
  );
};

export default AdminCompany;
