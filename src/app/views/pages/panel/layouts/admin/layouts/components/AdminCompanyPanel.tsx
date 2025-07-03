import { type FC } from 'react';
import CompanyIndexView from './CompanyIndexView';
import Navbar from '@/app/views/components/navbar/Navbar';

export const AdminCompanyPanel: FC = () => {
  return (
    <main className="panel-main actived">
      <section className="left">
        <div className="card">
          <CompanyIndexView />
        </div>
      </section>
      <section className="right">
        <Navbar />
        <div className="card" style={{ minHeight: 120, marginBottom: 12 }} />
        <div className="card" style={{ minHeight: 120 }} />
      </section>
    </main>
  );
};
