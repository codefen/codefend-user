import {
	ApiHandlers,
	useAdminCompanyStore,
	useModal,
} from '../../../../../../../data';
import {
	PrimaryButton,
	SecondaryButton,
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
	const [filterUsers, setFilterUsers] = useState<UserData[]>([]);

	const [selectedUser, setSelectedUser] =
		useState<UserData>(createEmptyUser());

	const { companySelected } = useAdminCompanyStore((state) => state);

	const handleInputChange = (value: any) => {
		const maxResults = 3;
		let count = 0;

		const filteredArray = usersToShow.filter((item: any) => {
			if (count >= maxResults) {
				return false;
			}
			if (
				item.name.includes(value) &&
				!item.read_array.includes(companySelected!.id) &&
				!item.write_array.includes(companySelected!.id)
			) {
				count++;
				return true;
			}
			return false;
		});

		setFilterUsers(filteredArray);
	};

	const handleAddUser = (e: any) => {
		e.preventDefault();

		if (selectedUser.id && companySelected!.id) {
			const requestBody = {
				userId: selectedUser.id,
				companyId: companySelected!.id,
				canWrite: selectedUser.canWrite,
				canRead: selectedUser.canRead,
			};

			ApiHandlers.addUserCompany(requestBody);
		}
	};

	return (
		<>
			<Show when={showModal}>
				<div
					onClick={() => setShowModal(!showModal)}
					className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 py-10">
					<div
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						className="max-h-full max-w-xl overflow-y-auto bg-white">
						<div className="w-full">
							<div className="w-full internal-tables">
								<div className="p-3 internal-tables-active flex">
									<p className="text-small text-left font-bold title-format">
										Add a user to the company
									</p>
								</div>
								<div className="container flex items-center justify-center  mx-auto p-3 text-format">
									<form className="p-6">
										<div className="relative flex items-center">
											<Show
												when={Boolean(selectedUser)}
												fallback={
													<span
														onClick={() => {
															setSelectedUser(null!);
														}}
														className="block w-full py-3 px-11 log-inputs cursor-pointer dark:text-gray-300 text-xs">
														{selectedUser.name}
													</span>
												}>
												<input
													type="text"
													onChange={(e) =>
														handleInputChange(e.target.value)
													}
													className="block w-full py-3 bg-white px-11 log-inputs dark:text-gray-300"
													placeholder="User name"></input>
											</Show>
										</div>
										{filterUsers.map((user) => (
											<div
												key={user.id}
												className="relative flex items-center">
												<span
													onClick={() => {
														setSelectedUser(user);
														setFilterUsers([]);
													}}
													className="block w-full py-3 px-11 log-inputs cursor-pointer dark:text-gray-300 text-xs">
													{user.name}
												</span>
											</div>
										))}

										<Show when={selectedUser.canRead}>
											<div>
												<div className="flex items-center">
													<input
														id="link-checkbox"
														type="checkbox"
														checked={selectedUser.canRead}
														onChange={() => {
															setSelectedUser((prevUser) => ({
																...prevUser,
																canRead: !prevUser.canRead,
															}));
														}}
														className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
													<label
														htmlFor="link-checkbox"
														className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
														Read permission
													</label>
												</div>
												<div className="flex items-center">
													<input
														id="link-checkbox"
														type="checkbox"
														checked={selectedUser.canWrite}
														onClick={() => {
															setSelectedUser((prevUser) => ({
																...prevUser,
																canWrite: !prevUser.canWrite,
															}));
														}}
														className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
													<label
														htmlFor="link-checkbox"
														className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
														Write permission
													</label>
												</div>
											</div>
										</Show>
										<div className="mt-6 internal-tables flex">
											<div
												style={{
													display: 'flex',
													paddingTop: '10px',
												}}
												className="form-buttons">
												<SecondaryButton
													text={'cancel'}
													click={() => {
														setShowModal(!showModal);
													}}
													className="btn-cancel codefend_secondary_ac"
												/>
												<PrimaryButton
													text={'create'}
													click={(e) => {
														handleAddUser(e);
													}}
													className="btn-add codefend_main_ac"
												/>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Show>
			<Show
				when={Boolean(companySelected)}
				fallback={
					<div className="encabezado internal-tables">
						<div className="p-3 pl-8 internal-tables-active">
							<p className="text-small text-left font-bold title-format">
								Company details
							</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">No company selected</p>
						</div>
					</div>
				}>
				<div>
					<div className="encabezado internal-tables">
						<div className="p-3 pl-8 internal-tables-active">
							<p className="title text-small title-format">
								Company details
							</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`name: ${companySelected?.name}`}</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`website: ${companySelected?.web}`}</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`country: ${companySelected?.pais_code}`}</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`city: ${companySelected?.pais_provincia}`}</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`address: ${companySelected?.pais_ciudad}`}</p>
						</div>
						<div className="flex pl-8 text-format cursor-pointer">
							<p className="text-base pt-3 pb-3">{`size: ${companySelected?.size}`}</p>
						</div>
					</div>
					<div className="encabezado internal-tables max-h-80 overflow-y-scroll">
						<div className="p-3 pl-8 internal-tables-active flex">
							<p className="text-small text-left font-bold title-format border-r pr-2">
								Company members
							</p>
							<p
								onClick={() => setShowModal(!showModal)}
								className="text-small text-left font-bold title-format border-r px-2 underline cursor-pointer codefend-text-red">
								Add member
							</p>
						</div>
						<div className="flex p-3 pl-8 text-format">
							<p className="text-base w-1/12">id</p>
							<p className="text-base w-6/12">full name</p>
							<p className="text-base w-2/12">role</p>
							<p className="text-base w-2/12">permissions</p>
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
										className="flex pl-8 text-format cursor-pointer"
										key={user.id} // Asegúrate de agregar una clave única para cada elemento en el array.
									>
										<p className="text-base w-1/12 pt-3 pb-3">
											{user.id}
										</p>
										<p className="w-6/12 text-base pt-3 pb-3">
											{user.name}
										</p>
										<p className="text-base w-2/12 pt-3 pb-3"> - </p>
										<p className="text-base w-2/12 pt-3 pb-3">{`Can write: ${user.write_array.includes(
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
