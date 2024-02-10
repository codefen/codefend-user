import React, { useContext } from 'react';
import {
	AppCardInfo,
	ProvidedTestingCredentials,
	VulnerabilityRisk,
	VulnerabilitiesStatus,
	IssuesPanelMobileAndCloud,
	PageLoader,
	Show,
} from '../../../../../components';
import {
	Issues,
	IssuesCondition,
	IssuesShare,
	MobileApp,
	useMobileOne,
	useModal,
} from '../../../../../../data';
import SelectedMobile from '../selectedContext';
import Order from '../../../../../components/modals/order';

export const MobileSelectedDetails: React.FC = (props) => {
	const selectedMobileApp = useContext(SelectedMobile);
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();
	const getSelected = selectedMobileApp
		? selectedMobileApp
		: ({} as MobileApp);

	const getSelectedMobileAppId = selectedMobileApp ? selectedMobileApp.id : '';
	const { isLoding, getMobile } = useMobileOne(getSelectedMobileAppId);

	return (
		<Show when={!isLoding} fallback={<PageLoader />}>
			<>
				<Show when={showModal && showModalStr === 'order'}>
					<Order
						closeModal={() => {
							setShowModalStr('');
							setShowModal(false);
						}}
					/>
				</Show>
				<div>
					<AppCardInfo
						type="mobile"
						selectedApp={getSelected}
						openOrder={() => {
							setShowModalStr('order');
							setShowModal(true);
						}}
					/>
				</div>
				<div className="selected-content">
					<div className="selected-content-credentials">
						<ProvidedTestingCredentials
							credentials={getMobile().creds ?? []}
							isLoading={isLoding}
						/>
					</div>
					<div className="selected-content-tables">
						<VulnerabilityRisk
							isLoading={isLoding}
							vulnerabilityByRisk={
								getMobile().issueShare
									? getMobile().issueShare
									: ({} as IssuesShare)
							}
						/>
						<VulnerabilitiesStatus
							vulnerabilityByShare={
								getMobile().issueCondition ?? ({} as IssuesCondition)
							}
						/>
					</div>
				</div>

				<section className="card table">
					<IssuesPanelMobileAndCloud
						isLoading={isLoding}
						issues={getMobile().issues ?? ([] as Issues[])}
					/>
				</section>
			</>
		</Show>
	);
};
