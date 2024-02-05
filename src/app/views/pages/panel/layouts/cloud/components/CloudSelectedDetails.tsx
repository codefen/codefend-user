import React, { useCallback, useContext, useEffect } from 'react';
import { CloudApp, useIssues } from '../../../../../../data';
import {
	PageLoader,
	AppCardInfo,
	IssuesPanelMobileAndCloud,
	ProvidedTestingCredentials,
	VulnerabilitiesStatus,
	VulnerabilityRisk,
	Show,
} from '../../../../../components';
import SelectedCloud from '../cloudProvider';

export const CloudSelectedDetails = () => {
	const selectedCloudApp = useContext(SelectedCloud);
	const getSelected = selectedCloudApp ? selectedCloudApp : ({} as CloudApp);

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
