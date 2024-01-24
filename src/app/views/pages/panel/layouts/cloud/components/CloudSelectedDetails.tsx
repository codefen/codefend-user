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

	const getSelectedMobileAppId = useCallback(
		() => (selectedCloudApp ? selectedCloudApp.id : ''),
		[],
	);
	const { getIssues, isLoading, refetchAll } = useIssues();
	useEffect(() => refetchAll(), []);
	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div>
					<AppCardInfo selectedApp={getSelected} />
				</div>
				<div className="flex items-center my-4 gap-x-4">
					<div className=" ">
						<VulnerabilityRisk
							isLoading={isLoading}
							vulnerabilityByRisk={getIssues()?.issueShare ?? {}}
						/>
					</div>
					<div className="flex flex-col flex-grow">
						<ProvidedTestingCredentials
							isLoading={isLoading}
							credentials={[]}
						/>
						<VulnerabilitiesStatus
							vulnerabilityByShare={getIssues()?.issueCondition ?? {}}
						/>
					</div>
				</div>

				<section className="card table flex-grow ">
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
