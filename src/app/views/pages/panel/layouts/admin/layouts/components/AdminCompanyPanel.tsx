import { ChangeEvent, useState, useEffect } from 'react';
import { useModal } from '../../../../../../../data';
import { ModalButtons, ModalTitleWrapper } from '../../../../../../components';
import CompanyIndexView from './CompanyIndexView';

interface AppState {
	companyStore: any | null;
	usersToShow: any[];
	filterUsers: any[];
	companyUsers: any[];
	selectedUser: any | null;
	isLoading: boolean;
}

const initialAppState: AppState = {
	companyStore: null,
	usersToShow: [],
	filterUsers: [],
	companyUsers: [],
	selectedUser: null,
	isLoading: false,
};

export const AdminCompanyPanel: React.FC<any> = () => {
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

	const { setShowModal, showModal } = useModal();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAppState((prevUserState) => ({
			...prevUserState,
			[name]: value,
		}));
	};

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Add a new company"
				close={() => setShowModal(false)}
				isActive={showModal}>
				<>
					<div className="container flex items-center justify-center  mx-auto p-3 text-format">
						<form className="p-6">
							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>

								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company name"></input>
							</div>

							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>

								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company URL"></input>
							</div>
							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>

								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company size"></input>
							</div>
							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>

								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company Country"></input>
							</div>

							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>
								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company City"></input>
							</div>
							<div className="relative flex items-center mt-4">
								<span className="absolute"></span>

								<input
									type="text"
									onChange={handleChange}
									className="block w-full py-3 bg-white border px-11 log-inputs dark:text-gray-300"
									placeholder="Company Adress"></input>
							</div>
							<ModalButtons
								confirmText="Create"
								close={() => setShowModal(!showModal)}
								isDisabled={isLoading}
							/>
						</form>
					</div>
				</>
			</ModalTitleWrapper>

			<div className="company-header-bar internal-tables">
				<div className="header-bar-options internal-tables-active">
					<p className="text-small title-format current-company">
						Current companies
					</p>
					<p
						onClick={() => setShowModal(!showModal)}
						className="company-btn text-small title-format codefend-text-red">
						Create new company
					</p>
				</div>
			</div>

			<CompanyIndexView />
		</>
	);
};
