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
				<div className="provided-testing-container">
					<div className="wrapper">
						<ProvidedTestingCredentials
							credentials={getMobile().creds ?? []}
							isLoading={isLoding}
						/>
					</div>
					<div className="dashboard-charts">
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
