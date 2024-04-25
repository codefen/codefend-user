import { type FC, useEffect, useState } from 'react';

import { IssuesPanelMobileAndCloud } from '@standalones/IssuesPanelMobileAndCloud.tsx';
import { AppCardInfo } from '@standalones/AppCardInfo.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@standalones/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';
import type {
	IssuesCondition,
	CloudApp,
	IssuesShare,
} from '@interfaces/panel.ts';
import { useOrderStore } from '@stores/orders.store.ts';

import {
	useSelectMobileCloudApp,
	type SelectMobileCloudApp,
} from '@stores/mobileCloudApp.store.ts';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
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

	if (!isLoading) {
		return (
			<>
				<CredentialsModal />
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
							resourceId={appSelected?.id || ''}
							type="cloud"
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
		);
	} else {
		return <PageLoader />;
	}
};
