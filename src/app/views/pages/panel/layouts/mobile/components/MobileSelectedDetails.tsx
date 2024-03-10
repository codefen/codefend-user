import React, { useEffect, useState } from 'react';
import {
	AppCardInfo,
	ProvidedTestingCredentials,
	VulnerabilityRisk,
	VulnerabilitiesStatus,
	IssuesPanelMobileAndCloud,
	PageLoader,
	Show,
	PrimaryButton,
	OrderV2,
} from '../../../../../components';
import {
	IssuesCondition,
	IssuesShare,
	MobileApp,
	MobileUnique,
	SelectMobileCloudApp,
	useModal,
	useOrderStore,
	useSelectMobileCloudApp,
} from '../../../../../../data';

export const MobileSelectedDetails: React.FC = (props) => {
	const [isLoding, setLoading] = useState<boolean>(false);

	const { appSelected, fetchMobileOne, appUnique } = useSelectMobileCloudApp(
		(state: SelectMobileCloudApp) => state,
	);
	const { updateState } = useOrderStore((state) => state);

	useEffect(() => {
		setLoading(true);

		fetchMobileOne().finally(() => setLoading(false));
	}, [appSelected]);

	return (
		<Show when={!isLoding} fallback={<PageLoader />}>
			<>
				<div>
					<AppCardInfo
						type="mobile"
						selectedApp={appSelected || ({} as MobileApp)}
					/>
				</div>
				<div className="selected-content">
					<div className="selected-content-credentials">
						<ProvidedTestingCredentials
							credentials={appUnique?.creds || []}
							isLoading={isLoding}
						/>
					</div>
					<div className="selected-content-tables">
						<PrimaryButton
							text="START A PENTEST ON DEMAND"
							click={() => updateState('open', true)}
							className="primary-full bottom"
						/>
						<VulnerabilityRisk
							isLoading={isLoding}
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
						isLoading={isLoding}
						issues={appUnique?.issues || []}
					/>
				</section>
			</>
		</Show>
	);
};
