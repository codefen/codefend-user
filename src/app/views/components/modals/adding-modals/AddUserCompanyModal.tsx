import { useState } from 'react';
import { ModalButtons, ModalTitleWrapper, Show } from '../..';
import { ApiHandlers } from '../../../../data/services';

interface Props {
	show: boolean;
	closeModal: () => void;
	selectedUser: any;
	updateSelectedUser: (updated: any) => void;
	usersToShow: any;
	companySelected: any;
}

interface UserData {
	id: string;
	name: string;
	canRead: boolean;
	canWrite: boolean;
	write_array: string[];
	read_array: string[];
}

export const AddUserCompanyModal: React.FC<Props> = ({
	closeModal,
	show,
	selectedUser,
	updateSelectedUser,
	usersToShow,
	companySelected,
}) => {
	const [filterUsers, setFilterUsers] = useState<UserData[]>([]);

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

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (selectedUser && selectedUser.id && companySelected!.id) {
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
		<ModalTitleWrapper
			close={closeModal}
			headerTitle="Add a user to the company"
			isActive={show}>
			<div className="content text-format">
				<form className="form" onSubmit={handleSubmit}>
					<div className="form-input">
						<Show
							when={Boolean(selectedUser)}
							fallback={
								<span
									onClick={() => updateSelectedUser(null)}
									className="static-value log-inputs">
									{selectedUser?.name}
								</span>
							}>
							<input
								type="text"
								onChange={(e) => handleInputChange(e.target.value)}
								placeholder="User name"></input>
						</Show>
					</div>
					{filterUsers.map((user) => (
						<div key={user.id} className="form-input">
							<span
								onClick={() => {
									updateSelectedUser(user);
									setFilterUsers([]);
								}}
								className="static-value log-inputs">
								{user.name}
							</span>
						</div>
					))}

					<Show when={selectedUser?.canRead}>
						<div>
							<div className="form-checkbox">
								<input
									id="link-checkbox"
									type="checkbox"
									defaultChecked={selectedUser?.canRead}
									onChange={() => {
										updateSelectedUser((prevUser: any) => ({
											...prevUser,
											canRead: !prevUser.canRead,
										}));
									}}
									className="codefend-checkbox"></input>
								<label htmlFor="link-checkbox" className="modal_info">
									Read permission
								</label>
							</div>
							<div className="form-checkbox">
								<input
									id="link-checkbox"
									type="checkbox"
									defaultChecked={selectedUser?.canWrite}
									onClick={() => {
										updateSelectedUser((prevUser: any) => ({
											...prevUser,
											canWrite: !prevUser.canWrite,
										}));
									}}
									className="codefend-checkbox"></input>
								<label htmlFor="link-checkbox" className="modal_info">
									Write permission
								</label>
							</div>
						</div>
					</Show>

					<ModalButtons
						confirmText="Create"
						close={closeModal}
						isDisabled={false}
					/>
				</form>
			</div>
		</ModalTitleWrapper>
	);
};
