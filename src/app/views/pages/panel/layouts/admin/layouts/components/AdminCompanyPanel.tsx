import { type FC } from 'react';
import CompanyIndexView from './CompanyIndexView';

export const AdminCompanyPanel: FC = () => {
  return (
    <>
      <div className="company-header-bar internal-tables">
        <div className="header-bar-options internal-tables-active">
          <p className="text-small title-format current-company">Current companies</p>
        </div>
      </div>

      <CompanyIndexView />
    </>
  );
};
