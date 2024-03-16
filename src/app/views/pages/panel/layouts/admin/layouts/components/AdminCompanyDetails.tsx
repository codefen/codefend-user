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
					<div className="encabezado internal-tables company-members">
						<div className="company-member-header internal-tables-active">
							<p className="text-small title-format company-title">
								Company members
							</p>
							<p
								onClick={() => setShowModal(!showModal)}
								className="text-small title-format company-text codefend-text-red">
								Add member
							</p>
						</div>
						<div className="company-columns text-format">
							<p className="l">id</p>
							<p className="xl">full name</p>
							<p className="xll">role</p>
							<p className="xll">permissions</p>
						</div>
					</div>
					<Show when={usersToShow.length > 0 && usersToShow[0].canRead}>
						<>
							{usersToShow
								.filter((user: any) =>
									user.read_array.includes(companySelected!.id),
								)
								.map((user: any) => (
									<div
										onClick={() => {
											setSelectedUser(user);
											setShowModal(!showModal);
										}}
										className="company-member-content text-format"
										key={user.id}>
										<p className="l">{user.id}</p>
										<p className="xll">{user.name}</p>
										<p className="xl"> - </p>
										<p className="xl">{`Can write: ${user.write_array.includes(
											companySelected!.id,
										)}`}</p>
									</div>
								))}
						</>
					</Show>
				</div>
			</Show>
		</>
	);
};

export default AdminCompanyDetails;
