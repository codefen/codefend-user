import { ChangeEvent, useState } from 'react';
import { useModal } from '../../../../../../../data';
import { ApiHandlers } from '../../../../../../../data/services/api.service';
import {
	PrimaryButton,
	SecondaryButton,
	Show,
} from '../../../../../../components/';
import CompanyIndexView from './CompanyIndexView';

interface AppState {
	companyStore: any | null;
	showModal: boolean;
	usersToShow: any[];
	filterUsers: any[];
	companyUsers: any[];
	selectedUser: any | null;
}

const initialAppState: AppState = {
	companyStore: null,
	showModal: false,
	usersToShow: [],
	filterUsers: [],
	companyUsers: [],
	selectedUser: null,
};

export const AdminCompanyPanel: React.FC<any> = () => {
	const [
		{ companyStore, companyUsers, filterUsers, selectedUser, usersToShow },
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

	const handleCreateCompany = (e: any) => {
		e.preventDefault();

		const requestBody = {
			userId: selectedUser!.id,
			companyId: companyStore!.id,
			canWrite: selectedUser!.canWrite,
			canRead: selectedUser!.canRead,
		};

		return ApiHandlers.createCompanyHandler(requestBody);
	};

	return (
		<>
			<Show when={showModal}>
				<div
					onClick={() => {
						setShowModal(!showModal);
					}}
					className="fixed left-0 top-0 flex h-full w-full z-20 items-center justify-center bg-black bg-opacity-20 py-10">
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
										Add a new company
									</p>
								</div>
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
										<div
											style={{ display: 'flex', paddingTop: '10px' }}
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
													handleCreateCompany(e);
												}}
												className="btn-add codefend_main_ac"
											/>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Show>

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
