import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import type { CompanyMember } from '@interfaces/dashboard';
import type { ColumnTableV3 } from '@interfaces/table';
import Tablev3 from '@table/v3/Tablev3';
import { useState, useEffect } from 'react';
interface DashboardAddCollaboratorsProps {
  isLoading: boolean;

  members: CompanyMember[];
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
export const TeamMembersTable = ({ isLoading, members }: DashboardAddCollaboratorsProps) => {
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
    <div className="team-members-table">
      <Tablev3 showRows={!isLoading} rows={membersMapped} columns={membersColumns} />
    </div>
  );
};
