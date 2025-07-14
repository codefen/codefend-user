import { type FC } from 'react';
import CompanyIndexView from './CompanyIndexView';
import Navbar from '@/app/views/components/navbar/Navbar';

export const AdminCompanyPanel: FC = () => {
  return (
    <div className="card">
      <CompanyIndexView />
    </div>
  );
};
