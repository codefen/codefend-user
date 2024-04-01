import { type FC, type ChangeEvent, useState } from 'react';
import { ModalButtons } from '@standalones/utils/ModalButtons.tsx';
import { GlobeWebIcon } from '@icons';
interface AddNewCompany {
	companyStore: any | null;
	usersToShow: any[];
	filterUsers: any[];
	companyUsers: any[];
	selectedUser: any | null;
	isLoading: boolean;
}

const initialAppState: AddNewCompany = {
	companyStore: null,
	usersToShow: [],
	filterUsers: [],
	companyUsers: [],
	selectedUser: null,
	isLoading: false,
};

interface AddCompanyModalProps {
	closeModal: () => void;
}

export const AddCompanyModal: FC<AddCompanyModalProps> = ({ closeModal }) => {
	const [
		{
			companyStore,
			companyUsers,
			filterUsers,
			selectedUser,
			usersToShow,
			isLoading,
		},
		setAppState,
	] = useState(initialAppState);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAppState((prevUserState: any) => ({
			...prevUserState,
			[name]: value,
		}));
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
	};

	return (
		<div className="content">
			<form className="form" onSubmit={handleSubmit}>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleChange}
						placeholder="Company name"></input>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleChange}
						placeholder="Company URL"></input>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleChange}
						placeholder="Company size"></input>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleChange}
						placeholder="Company Country"></input>
				</div>

				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>
					<input
						type="text"
						onChange={handleChange}
						placeholder="Company City"></input>
				</div>
				<div className="form-input">
					<span className="icon">
						<GlobeWebIcon />
					</span>

					<input
						type="text"
						onChange={handleChange}
						placeholder="Company Adress"></input>
				</div>
				<ModalButtons
					confirmText="Create"
					close={closeModal}
					isDisabled={isLoading}
				/>
			</form>
		</div>
	);
};
