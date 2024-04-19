import { type FC, useEffect, useState } from 'react';
import {
	type CloudApp,
	type IssuesCondition,
	type IssuesShare,
	type SelectMobileCloudApp,
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
	PrimaryButton,
} from '../../../../../components';
import { useUserRole } from '#commonUserHooks/useUserRole';

export const CloudSelectedDetails: FC = () => {
	const [isLoading, setLoading] = useState<boolean>(false);
	const { appSelected, fetchCloudOne, appUnique } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { updateState } = useOrderStore((state) => state);
	const { isAdmin, isNormalUser } = useUserRole();
	useEffect(() => {
		setLoading(true);

		fetchCloudOne().finally(() => setLoading(false));
	}, [appSelected]);

	return (
		<Show when={!isLoading} fallback={<PageLoader />}>
			<>
				<div>
					<AppCardInfo
						selectedApp={appSelected || ({} as CloudApp)}
						type="cloud"
						issueCount={appUnique?.issues?.length || 0}
					/>
				</div>
				<div className="selected-content">
					<div className="selected-content-credentials">
						<ProvidedTestingCredentials
							credentials={appUnique?.creds || []}
							isLoading={isLoading}
						/>
					</div>
					<div className="selected-content-tables">
						<Show when={isAdmin() || isNormalUser()}>
							<PrimaryButton
								text="START A PENTEST ON DEMAND"
								click={() => updateState('open', true)}
								className="primary-full bottom"
							/>
						</Show>
						<VulnerabilityRisk
							isLoading={isLoading}
							vulnerabilityByRisk={
								appUnique?.issueShare || ({} as IssuesShare)
							}
						/>
						<VulnerabilitiesStatus
							vulnerabilityByShare={
								appUnique?.issueCondition || ({} as IssuesCondition)
							}
						/>
					</div>
				</div>

				<section className="card table">
					<IssuesPanelMobileAndCloud
						isLoading={isLoading}
						issues={appUnique?.issues || []}
					/>
				</section>
			</>
		</Show>
	);
};
