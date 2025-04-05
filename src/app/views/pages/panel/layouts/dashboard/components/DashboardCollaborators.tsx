import { type FC } from 'react';

import { PeopleGroupIcon } from '@icons';
import { type ColumnTableV3 } from '@interfaces/table';
import type { CompanyMember } from '@interfaces/dashboard';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';

interface DashboardCollaboratorsProps {
  members: CompanyMember[];
  isLoading: boolean;
}

export const membersColumns: ColumnTableV3[] = [
  {
    header: 'ID',
    key: 'id',
    styles: 'item-cell-1',
    weight: '7%',
    render: value => value,
  },
  {
    header: 'Full Name',
    key: 'fname',
    type: TABLE_KEYS.FULL_ROW,
    styles: 'item-cell-2',
    weight: '26%',
    render: member => `${member.fname} ${member.lname}`,
  },
  {
    header: 'Email',
    key: 'email',
    styles: 'item-cell-3',
    weight: '31%',
    render: value => value,
  },
  {
    header: 'Phone',
    key: 'phone',
    styles: 'item-cell-4',
    weight: '23%',
    render: value => value,
  },
  {
    header: 'Role',
    key: 'role',
    styles: 'item-cell-5',
    weight: '13%',
    render: value => value,
  },
];

const DashboardCollaborators: FC<DashboardCollaboratorsProps> = ({ members, isLoading }) => {
  return (
    <div className="collaborators card">
      <SimpleSection header="Team members" icon={<PeopleGroupIcon />}>
        <Tablev3 rows={members} columns={membersColumns} showRows={!isLoading} />
      </SimpleSection>
    </div>
  );
};

export default DashboardCollaborators;
