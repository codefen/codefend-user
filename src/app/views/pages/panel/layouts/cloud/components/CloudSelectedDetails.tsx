import React, { useEffect } from 'react';
import {
	CloudApp,
	SelectMobileCloudApp,
	useIssues,
	useOrderStore,
	useSelectMobileCloudApp,
} from '../../../../../../data';
import {
	PageLoader,
	AppCardInfo,
	IssuesPanelMobileAndCloud,
	ProvidedTestingCredentials,
	VulnerabilitiesStatus,
	VulnerabilityRisk,
	Show,
} from '../../../../../components';

export const CloudSelectedDetails = () => {
	const { appSelected } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { updateState } = useOrderStore((state) => state);
	const getSelected = appSelected ? appSelected : ({} as CloudApp);

	const { getIssues, isLoading, refetchAll } = useIssues();

	useEffect(() => refetchAll(), []);
	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div>
					<AppCardInfo selectedApp={getSelected} type="cloud" />
				</div>
				<div className="selected-content">
					<div className=" ">
						<VulnerabilityRisk
							isLoading={isLoading}
							vulnerabilityByRisk={getIssues()?.issueShare ?? {}}
						/>
					</div>
					<div className="selected-content-tables">
						<ProvidedTestingCredentials
							isLoading={isLoading}
							credentials={[]}
						/>
						<VulnerabilitiesStatus
							vulnerabilityByShare={getIssues()?.issueCondition ?? {}}
						/>
					</div>
				</div>

				<section className="card table">
					<IssuesPanelMobileAndCloud
						isLoading={isLoading}
						issues={getIssues()?.issues ?? {}}
						refetch={refetchAll}
					/>
				</section>
			</>
		</Show>
	);
};
