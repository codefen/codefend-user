import React, { Suspense, useCallback, useState } from 'react';

import {
	PageLoader,
	PeopleGroup,
	Show,
	SimpleSection,
	Table,
} from '../../../../../components';
import { CompanyMember, collaboratorsColumns } from '../../../../../../data';
import { TableItem, TableV2 } from '../../../../../components/Table/tablev2';

const DashboardCollaborators: React.FC<{
	members: CompanyMember[];
	isLoading: boolean;
}> = ({ members, isLoading }) => {
	const dataTable = members.map(
		(member: CompanyMember) =>
			({
				ID: { value: member.id, style: 'id' },
				fullName: {
					value: member.name + ' ' + member.lastName,
					style: 'full-name',
				},
				email: { value: member.email, style: 'email' },
				phone: { value: member.phone, style: 'phone' },
				role: { value: member.companyRole, style: 'role' },
			}) as Record<string, TableItem>,
	);

	return (
		<div className="card colaborators flex-grow">
			<SimpleSection
				header="Collaborators and team members"
				icon={<PeopleGroup />}>
				<TableV2
					rowsData={dataTable}
					showRows={!isLoading}
					showEmpty={!isLoading && dataTable.length === 0}
					columns={collaboratorsColumns}
					sizeY={20}
				/>
			</SimpleSection>
		</div>
	);
};

export default DashboardCollaborators;
