import { Suspense, useEffect, useState } from 'react';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar';
import { ProviderList } from './components/ProviderList';
import { useProviderSidebar } from './hook/useProviderSidebar';
import { ProviderHeader } from './components/ProviderHeader';
import { formatToMonthYear, useAuthState } from '../../../../../data';
import './provider.scss';
import { Outlet } from 'react-router';

export const ProviderPage = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [sidebarOption] = useProviderSidebar();
	const { getUserdata } = useAuthState();

	useEffect(() => {
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, []);
	console.log({ userdata: getUserdata() });
	const profileMedia = getUserdata().profileMedia
		? `data:image/png;base64, ${getUserdata().profileMedia}`
		: undefined;
	return (
		<main className={`provider ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ProviderHeader
					bannerImg="https://t4.ftcdn.net/jpg/02/71/29/75/360_F_271297554_0DAlzyFb8jzYg0lfmUOzyhtMer0orz4h.jpg"
					profileMedia={`${profileMedia ? profileMedia : '/util/default-profilemedia.webp'}`}
					name={`${getUserdata().name} ${getUserdata().lastName}`}
					providerTitle="Offensive Security research"
					memberTime={formatToMonthYear(getUserdata().createdAt)}
					isVerified
					location="Floridablanca, Santander, Cordoba"
					totalAudits={246}
					score={4.55}
					totalReview={236}
				/>
				<div className="provider-content">
					<ProviderSidebar activeOption={sidebarOption} />
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
