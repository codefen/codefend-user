import { useEffect, useState } from 'react';
import { usePreferences } from '../../../../../data';
import { PageLoader, Show } from '../../../../../views/components';
import SettingCollaboratorAndTeam from './components/SettingCollaboratorAndTeam';
import SettingCompanyInformation from './components/SettingCompanyInformation';
import SettingOrderAndBilling from './components/SettingOrderAndBilling';
import '../../../../styles/flag.scss';
import SettingPersonalDetails from './components/SettingPersonaDetails';

import './preference.scss';

const PreferencePanel = () => {
	const [showScreen, setShowScreen] = useState(false);
	const { loading, company, members, orders } = usePreferences();

	useEffect(() => {
		setTimeout(() => {
			setShowScreen(true);
		}, 50);
	});

	return (
		<>
			<Show when={showScreen} fallback={<PageLoader />}>
				<main className={`preferences ${showScreen ? 'actived' : ''}`}>
					<section className="left">
						<SettingOrderAndBilling
							isLoading={loading}
							orders={orders ?? []}
						/>
						<SettingCollaboratorAndTeam
							isLoading={loading}
							members={members ?? []}
						/>
					</section>
					<section className="right">
						<SettingCompanyInformation companyInfo={company} />
						<SettingPersonalDetails />
					</section>
				</main>
			</Show>
		</>
	);
};

export default PreferencePanel;
