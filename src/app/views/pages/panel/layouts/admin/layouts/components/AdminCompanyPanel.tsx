import { type FC, useState } from 'react';
import { useModal } from '../../../../../../../data';
import {
	AddCompanyModal,
	ModalTitleWrapper,
} from '../../../../../../components';
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

export const AdminCompanyPanel: FC = () => {
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

	return (
		<>
			<ModalTitleWrapper
				headerTitle="Add a new company"
				close={() => setShowModal(false)}
				isActive={showModal}>
				<AddCompanyModal closeModal={() => setShowModal(false)} />
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
