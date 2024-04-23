import { type FC } from 'react';
import type { Member } from '@interfaces/panel';
import { PeopleGroupIcon } from '@icons';
import { TableV2 } from '@table/tablev2';
import { companyMembersColumns } from '@mocks/defaultData';

interface CollaboratorDataProps {
	isLoading: boolean;
	members: Member[];
}

const SettingCollaboratorAndTeam: FC<CollaboratorDataProps> = ({
	members,
	isLoading,
}) => {
	const dataTable = members.map((member) => ({
		ID: { value: '', style: '' },
		Identifier: { value: member.id, style: 'id' },
		fullName: {
			value: `${member.fname} ${member.lname}`,
			style: 'full-name',
		},
		email: { value: member.email, style: 'email' },
		phone: { value: member.phone, style: 'phone' },
		role: { value: member.role, style: 'role' },
	}));
	return (
		<div className="card table">
			<div className="header">
				<div className="title">
					<div className="icon">
						<PeopleGroupIcon />
					</div>
					<span>COLLABORATORS AND TEAM MEMBERS</span>
				</div>
				<div className="actions"></div>
			</div>
			<TableV2
				columns={companyMembersColumns}
				rowsData={dataTable}
				showRows={!isLoading}
				showEmpty={!Boolean(dataTable.length) && !isLoading}
			/>
		</div>
	);
};

export default SettingCollaboratorAndTeam;
