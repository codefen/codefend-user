import { useEffect, useState, type FC } from 'react';

import { PeopleGroupIcon } from '@icons';
import { type ColumnTableV3 } from '@interfaces/table';
import type { CompanyMember } from '@interfaces/dashboard';
import { TABLE_KEYS } from '@/app/constants/app-texts';
import Tablev3 from '@table/v3/Tablev3';
import { SimpleSection } from '@/app/views/components/SimpleSection/SimpleSection';
import { useUserData } from '#commonUserHooks/useUserData';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

interface DashboardCollaboratorsProps {
  members: CompanyMember[];
  isLoading: boolean;
}

export const membersColumns: ColumnTableV3[] = [
  {
    header: 'Email',
    key: 'email',
    styles: 'item-cell-3',
    weight: '31%',
    render: value => value,
  },
  {
    header: 'Member role',
    key: 'is_owner',
    styles: 'item-cell-5',
    weight: '13%',
    render: value => (value ? 'Founder' : 'Collaborator'),
  },
];

const DashboardCollaborators: FC<DashboardCollaboratorsProps> = ({ members, isLoading }) => {
  const [membersMapped, setMembersMapped] = useState<any[]>([]);
  const company = useGlobalFastField('company');

  useEffect(() => {
    setMembersMapped(
      members.map(member => ({
        ...member,
        is_owner: company.get.owner_email === member.email,
      }))
    );
  }, [members, company.get.owner_email]);

  return (
    <div className="collaborators">
      <Tablev3 rows={membersMapped} columns={membersColumns} showRows={!isLoading} />
    </div>
  );
};

export default DashboardCollaborators;
