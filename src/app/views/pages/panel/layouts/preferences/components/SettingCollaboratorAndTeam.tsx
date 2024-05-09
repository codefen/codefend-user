import { type FC } from 'react';
import type { Member } from '@interfaces/panel';
import { ExitIcon, PeopleGroupIcon } from '@icons';
import { TableV2 } from '@table/tablev2';
import { preferenceMemberColumns } from '@mocks/defaultData';
import useModalStore from '@stores/modal.store';
import { LocationItem } from '@standalones/index';

interface CollaboratorDataProps {
	isLoading: boolean;
	members: Member[];
}

const SettingCollaboratorAndTeam: FC<CollaboratorDataProps> = ({
	members,
	isLoading,
}) => {
	const { setModalId, setIsOpen } = useModalStore();
	const dataTable = members.map((member) => ({
		ID: { value: '', style: '' },
		Identifier: { value: Number(member.id), style: 'id' },
		area: {
			value: (
				<LocationItem
					country={member.pais || 'unknown'}
					countryCode={member.pais_code}
				/>
			),
			style: 'area',
		},
		company: { value: member.company_name, style: 'company' },
		fullName: {
			value: `${member.fname} ${member.lname}`,
			style: 'full-name',
		},
		email: { value: member.email, style: 'email' },
		phone: { value: member.phone, style: 'phone' },
		role: { value: member.role, style: 'role' },
		action: {
			value: (
				<>
					<span
						title="Remove from the company"
						className={`${!member.company_access_ids ? 'off' : ''}`}>
						<ExitIcon />
					</span>
				</>
			),
			style: 'id action',
		},
	}));

	const handleAddCollaborator = () => {
		setModalId('add-collaborator');
		setIsOpen(true);
	};
	return (
		<div className="card member-tables">
			<div className="header">
				<div className="title">
					<div className="icon">
						<PeopleGroupIcon />
					</div>
					<span>COLLABORATORS AND TEAM MEMBERS</span>
				</div>
				<div className="actions">
					<div onClick={handleAddCollaborator}>Add collaborator</div>
				</div>
			</div>
			<TableV2
				columns={preferenceMemberColumns}
				rowsData={dataTable}
				showRows={!isLoading}
				showEmpty={!Boolean(dataTable.length) && !isLoading}
			/>
		</div>
	);
};

export default SettingCollaboratorAndTeam;
