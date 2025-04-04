import { type FC, useEffect } from 'react';
import CompanyCard from './CompanyCard.tsx';
import useAdminCompanyStore from '@stores/adminCompany.store.ts';
import { type AdminCompany } from '@stores/adminCompany.store.ts';
import './CompanyIndexView.scss';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import TableCellV3 from '@table/v3/TableCellV3.tsx';
import Tablev3 from '@table/v3/Tablev3.tsx';

const companiesColumn: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '3%',
    render: (ID: any) => ID,
  },
  {
    header: 'Name',
    key: 'name',
    styles: 'item-cell-2',
    weight: '14%',
    render: (name: any) => name,
  },
  {
    header: 'Plan',
    key: 'plan',
    styles: 'item-cell-3',
    weight: '6%',
    render: (val: any) => val,
  },
  {
    header: 'Issues Left',
    key: 'disponibles_issues_view',
    styles: 'item-cell-4',
    weight: '9%',
    render: (val: any) => val,
  },
  {
    header: 'Scans',
    key: 'disponibles_neuroscan',
    styles: 'item-cell-5',
    weight: '5%',
    render: (val: any) => val,
  },
  {
    header: 'Country',
    key: 'mercado',
    styles: 'item-cell-6',
    weight: '9%',
    render: (val: any) => val,
  },
  {
    header: 'Website',
    key: 'web',
    styles: 'item-cell-7',
    weight: '14%',
    render: (val: any) => val,
  },
  {
    header: 'Owner',
    key: 'owner_email',
    styles: 'item-cell-8',
    weight: '27%',
    render: (val: any) => val,
  },
  {
    header: 'Published',
    key: 'creacion',
    styles: 'item-cell-9',
    weight: '13%',
    render: (val: any) => (val ? val.split(' ')[0] : '--/--/--'),
  },
];

const CompanyIndexView: FC = () => {
  const { isAdmin } = useUserRole();
  const { getCompany } = useGetCompany();
  const { companies, companySelected, isSelectedCompany, updateCompanies } = useAdminCompanyStore(
    state => state
  );

  const { selectCompany } = useAdminCompanyStore(state => state);

  useEffect(() => {
    if (isAdmin()) {
      getCompany().then(({ data }: any) => {
        updateCompanies(data.companies);
      });
    }
    if (isAdmin() && !companySelected) {
      selectCompany(companies[0] || undefined);
    }
  }, []);

  return (
    <div className="CompanyIndexView">
      <Tablev3
        columns={companiesColumn}
        rows={companies}
        showRows={Boolean(companies?.length)}
        isNeedSearchBar
        initialOrder="name"
        initialSort={Sort.desc}
        action={company => selectCompany(company)}
        selected={companySelected}
        selectedKey="id"
      />
    </div>
  );
};

export default CompanyIndexView;
