import { useEffect, useState, type FC } from 'react';
import { type ColumnTableV3 } from '@interfaces/table';
import type { CompanyMember } from '@interfaces/dashboard';
import Tablev3 from '@table/v3/Tablev3';
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
    weight: '50%',
    render: value => value,
  },
  {
    header: 'Member role',
    key: 'is_owner',
    styles: 'item-cell-5 text-right',
    weight: '50%',
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
  console.log('isLoading', isLoading);

  return (
    <div className="collaborators">
      <Tablev3
        rows={membersMapped}
        columns={membersColumns}
        showRows={true}
        showSkeleton={isLoading}
        totalRowCount={5}
      />
    </div>
  );
};

export default DashboardCollaborators;
