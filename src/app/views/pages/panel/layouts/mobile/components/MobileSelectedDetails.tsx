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
	useMobileOne,
} from '../../../../../../data';
import SelectedMobile from '../selectedContext';

export const MobileSelectedDetails: React.FC = () => {
	const selectedMobileApp = useContext(SelectedMobile);
	const getSelected = selectedMobileApp
		? selectedMobileApp
		: ({} as MobileApp);

	const getSelectedMobileAppId = selectedMobileApp ? selectedMobileApp.id : '';
	const { isLoding, getMobile } = useMobileOne(getSelectedMobileAppId);

	return (
		<Show when={!isLoding} fallback={<PageLoader />}>
			<>
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
							click={() => alert('proccess your order')}
							className="w-full mb-4"
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
