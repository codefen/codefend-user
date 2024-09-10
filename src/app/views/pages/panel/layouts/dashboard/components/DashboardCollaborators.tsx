import { type FC } from 'react';

import { PeopleGroupIcon, SimpleSection } from '../../../../../components';
import { memberColumn, type TableItem } from '../../../../../../data';
import { TableV2 } from '../../../../../components/table/tablev2';
import type { CompanyMember } from '@interfaces/dashboard';

interface DashboardCollaboratorsProps {
  members: CompanyMember[];
  isLoading: boolean;
}

const DashboardCollaborators: FC<DashboardCollaboratorsProps> = ({ members, isLoading }) => {
  const dataTable = members.map(
    (member: CompanyMember) =>
      ({
        ID: { value: member.id, style: 'id' },
        fullName: {
          value: `${member.fname} ${member.lname}`,
          style: 'full-name',
        },
        email: { value: member.email, style: 'email' },
        phone: { value: member.phone, style: 'phone' },
        role: { value: member.role, style: 'role' },
      }) as Record<string, TableItem>
  );

  return (
    <div className="collaborators card">
      <SimpleSection header="Team members" icon={<PeopleGroupIcon />}>
        <TableV2
          rowsData={dataTable}
          showRows={!isLoading}
          showEmpty={!isLoading && dataTable.length === 0}
          columns={memberColumn}
        />
      </SimpleSection>
    </div>
  );
};

export default DashboardCollaborators;
