import React, { useContext } from 'react';
import {
	AppCardInfo,
	ProvidedTestingCredentials,
	VulnerabilityRisk,
	VulnerabilitiesStatus,
	IssuesPanelMobileAndCloud,
	PageLoader,
	Show,
	PrimaryButton,
} from '../../../../../components';
import {
	Issues,
	IssuesCondition,
	IssuesShare,
	MobileApp,
	SelectMobileCloudApp,
	useMobileOne,
	useModal,
	useSelectMobileCloudApp,
} from '../../../../../../data';
import Order from '../../../../../components/modals/order';

export const MobileSelectedDetails: React.FC = (props) => {
	const { appSelected } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { showModal, showModalStr, setShowModal, setShowModalStr } =
		useModal();

	console.log({ appSelected });
	const getSelected = appSelected ? appSelected : ({} as MobileApp);

	const getSelectedMobileAppId = appSelected ? appSelected.id : '';
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
					<AppCardInfo type="mobile" selectedApp={getSelected} />
				</div>
				<div className="selected-content">
					<div className="selected-content-credentials">
						<ProvidedTestingCredentials
							credentials={getMobile().creds ?? []}
							isLoading={isLoding}
						/>
					</div>
					<div className="selected-content-tables">
						<PrimaryButton
							text="START A PENTEST ON DEMAND"
							click={() => {
								setShowModalStr('order');
								setShowModal(true);
							}}
							className="primary-full bottom"
						/>
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
