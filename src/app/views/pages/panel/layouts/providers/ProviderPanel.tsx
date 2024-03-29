import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar';
import { ProviderList } from './components/ProviderList';
import { ProviderHeader } from './components/ProviderHeader';
import { formatToMonthYear, useProviderProfile } from '../../../../../data';
import './provider.scss';

export const ProviderPage = () => {
	const [showScreen, setShowScreen] = useState(false);
	const { providerProfile, refetch } = useProviderProfile();

	useEffect(() => {
		setShowScreen(false);
		if (!providerProfile) {
			refetch();
		}
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, []);

	const profileMedia = providerProfile
		? `data:image/png;base64, ${providerProfile.profile_media}`
		: undefined;
	return (
		<main className={`provider ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ProviderHeader
					bannerImg=""
					profileMedia={`${profileMedia ? profileMedia : '/util/default-profilemedia.webp'}`}
					name={`${providerProfile ? providerProfile.fname : ' Loading...'} ${providerProfile ? providerProfile.lname : ''}`}
					providerTitle="Offensive Security research"
					memberTime={
						providerProfile
							? formatToMonthYear(providerProfile.creacion)
							: '...'
					}
					isVerified
					location="Floridablanca, Santander, Cordoba"
					totalAudits={0}
					score={0}
					totalReview={0}
				/>
				<div className="provider-content">
					<ProviderSidebar />
					<div className="provider-main-content">
						<Suspense>
							<Outlet />
						</Suspense>
					</div>
				</div>
			</section>
			<section className="right">
				<ProviderList />
			</section>
		</main>
	);
};
