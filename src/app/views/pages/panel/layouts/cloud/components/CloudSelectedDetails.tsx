import { type FC, useEffect } from 'react';

import { IssuesPanelMobileAndCloud } from '@standalones/IssuesPanelMobileAndCloud.tsx';
import { AppCardInfo } from '@standalones/AppCardInfo.tsx';
import { CredentialsModal } from '@modals/credentials/CredentialsModal.tsx';
import { ProvidedTestingCredentials } from '@standalones/credential-card/ProvidedTestingCredentials';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';
import { useOrderStore } from '@stores/orders.store.ts';

import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { useSelectedApp } from '@resourcesHooks/useSelectedApp';
import { useGetOneCloud } from '@resourcesHooks/cloud/useGetOneCloud';
import { RESOURCE_CLASS } from '@/app/constants/app-texts';

export const CloudSelectedDetails: FC = () => {
	const { isAdmin, isNormalUser } = useUserRole();
	const { appSelected } = useSelectedApp();
	const { data, isLoading, refetch } = useGetOneCloud();
	const { updateState } = useOrderStore((state) => state);

	const onRefetch = () => refetch(appSelected?.id);
	useEffect(() => {
		if (appSelected) onRefetch();
	}, [appSelected]);

	if (!isLoading) {
		return (
			<>
				<CredentialsModal onComplete={onRefetch} />
				<div>
					<AppCardInfo
						selectedApp={appSelected || {}}
						type={RESOURCE_CLASS.CLOUD}
						issueCount={data?.issues ? data.issues.length : 0}
					/>
				</div>
				<div className="selected-content">
					<div className="selected-content-credentials">
						<ProvidedTestingCredentials
							credentials={data?.creds || []}
							isLoading={isLoading}
							resourceId={appSelected?.id || ''}
							type={RESOURCE_CLASS.CLOUD}
						/>
					</div>
					<div className="selected-content-tables">
						<Show when={isAdmin() || isNormalUser()}>
							<PrimaryButton
								text="START A PENTEST ON DEMAND"
								click={() => updateState('open', true)}
								className="primary-full"
							/>
						</Show>
						<VulnerabilityRisk
							isLoading={isLoading}
							vulnerabilityByRisk={data?.issues_share || {}}
						/>
						<VulnerabilitiesStatus
							vulnerabilityByShare={data?.issues_condicion || {}}
						/>
					</div>
				</div>

				<section className="card table">
					<IssuesPanelMobileAndCloud
						isLoading={isLoading}
						issues={data?.issues || []}
					/>
				</section>
			</>
		);
	} else {
		return <PageLoader />;
	}
};
