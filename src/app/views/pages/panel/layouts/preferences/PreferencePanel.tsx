import { usePreferences } from '@panelHooks/preference/usePreferences.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Show from '@defaults/Show.tsx';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import SettingCollaboratorAndTeam from './components/SettingCollaboratorAndTeam.tsx';
import SettingCompanyInformation from './components/SettingCompanyInformation.tsx';
import SettingOrderAndBilling from './components/SettingOrderAndBilling.tsx';
import SettingPersonalDetails from './components/SettingPersonaDetails.tsx';

import './preference.scss';
import { useEffect } from 'react';

const PreferencePanel = () => {
	const [showScreen] = useShowScreen();
	const { orders, company, members, isLoading, refetch } = usePreferences();

	useEffect(() => {
		refetch();
	}, []);

	return (
		<>
			<Show when={showScreen} fallback={<PageLoader />}>
				<main className={`preferences ${showScreen ? 'actived' : ''}`}>
					<section className="left">
						<SettingCollaboratorAndTeam
							isLoading={isLoading}
							members={members}
						/>
						<SettingOrderAndBilling
							isLoading={isLoading}
							orders={orders}
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
