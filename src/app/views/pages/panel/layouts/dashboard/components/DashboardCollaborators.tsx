import { type FC } from 'react';

import { SimpleSection } from '@/app/components/SimpleSection/SimpleSection';
import { PeopleGroupIcon } from '@icons';
import { type TableItem } from '@interfaces/table';
import { memberColumn } from '@mocks/defaultData';
import { TableV2 } from '@table/tablev2';
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
