import { useUserRole } from '#commonUserHooks/useUserRole';
import { useAdminCompanyStore, useModal } from '../../../../../../../data';
import {
	AddUserCompanyModal,
	Show,
} from '../../../../../../../views/components';
import React, { useState } from 'react';

interface UserData {
	id: string;
	name: string;
	canRead: boolean;
	canWrite: boolean;
	write_array: string[];
	read_array: string[];
}

const createEmptyUser = (): UserData => ({
	id: '',
	name: '',
	canRead: false,
	canWrite: false,
	write_array: [],
	read_array: [],
});

const AdminCompanyDetails: React.FC = () => {
	const { showModal, setShowModal } = useModal();
	const [usersToShow, setUsersToShow] = useState<UserData[]>([]);
	const { isAdmin, isProvider } = useUserRole();
	const [selectedUser, setSelectedUser] = useState<UserData | null>(
		createEmptyUser(),
	);

	const { companySelected } = useAdminCompanyStore((state) => state);

	return (
		<>
			<AddUserCompanyModal
				closeModal={() => setShowModal(false)}
				show={showModal}
				companySelected={companySelected}
				usersToShow={usersToShow}
				selectedUser={selectedUser}
				updateSelectedUser={(updated: any) => setSelectedUser(updated)}
			/>
			<Show
				when={Boolean(companySelected)}
				fallback={
					<div className="encabezado internal-tables company-selected-fallback">
						<div className="company-selected-detail internal-tables-active">
							<p className="text-small title-format">Company details</p>
						</div>
						<div className="company-no-selected text-format">
							<p>No company selected</p>
						</div>
					</div>
				}>
				<div>
					<div className="encabezado internal-tables company-selected">
						<div className="company-selected-header internal-tables-active">
							<p className="title text-small title-format">
								Company details
							</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`name: ${companySelected?.name}`}</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`website: ${companySelected?.web}`}</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`country: ${companySelected?.pais_code}`}</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`city: ${companySelected?.pais_provincia}`}</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`address: ${companySelected?.pais_ciudad}`}</p>
						</div>
						<div className="company-selected-item text-format">
							<p>{`size: ${companySelected?.size}`}</p>
						</div>
					</div>
					<div className="encabezado internal-tables company-members"></div>
				</div>
			</Show>
		</>
	);
};

export default AdminCompanyDetails;
