import { type FC } from 'react';
import AdminPanelApprove from './components/AdminPanelApprove';
import './adminUser.scss';

const AdminUserLayout: FC = () => (
  <main className="admin-user">
    <section className="left">
      <AdminPanelApprove />
    </section>
    <section className="right">
      <div className="right-section-title title title-format"></div>
    </section>
  </main>
);

export default AdminUserLayout;
