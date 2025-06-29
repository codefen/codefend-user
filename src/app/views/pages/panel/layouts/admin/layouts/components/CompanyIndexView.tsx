import { type FC, useEffect } from 'react';
import CompanyCard from './CompanyCard.tsx';
import './CompanyIndexView.scss';
import { useGetCompany } from '@userHooks/admins/useGetCompany';
import { Sort, type ColumnTableV3 } from '@interfaces/table.ts';
import Tablev3 from '@table/v3/Tablev3.tsx';
import { naturalTime } from '@utils/helper.ts';
import {
  useGlobalFastField,
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';

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
    render: (val: any) => (val ? naturalTime(val) : '--/--/--'),
  },
];

const CompanyIndexView: FC = () => {
  const { data, company } = useGetCompany();
  const {
    selectedApp,
    domainCount,
    subNetworkCount,
    externalIpCount,
    internalIpCount,
    totalNotUniqueIpCount,
  } = useGlobalFastFields([
    'selectedApp',
    'domainCount',
    'subNetworkCount',
    'externalIpCount',
    'internalIpCount',
    'totalNotUniqueIpCount',
  ]);

  const action = (clickedCompany: any) => {
    company.set(clickedCompany);
    selectedApp.set(null);
    domainCount.set(0);
    subNetworkCount.set(0);
    externalIpCount.set(0);
    internalIpCount.set(0);
    totalNotUniqueIpCount.set(0);
  };

  return (
    <div className="CompanyIndexView">
      <Tablev3
        columns={companiesColumn}
        rows={data}
        showRows={Boolean(data?.length)}
        isNeedSearchBar
        initialOrder="id"
        initialSort={Sort.desc}
        action={action}
        selected={company.get}
        selectedKey="id"
        className="table-admin"
      />
    </div>
  );
};

export default CompanyIndexView;
