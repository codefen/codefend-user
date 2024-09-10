import { type FC } from 'react';
import { AdminCompanyPanel } from './components/AdminCompanyPanel';
import AdminCompanyDetails from './components/AdminCompanyDetails';
import { useShowScreen } from '#commonHooks/useShowScreen';
import '../admin.scss';

const AdminCompany: FC = () => {
  const [showScreen] = useShowScreen();
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
