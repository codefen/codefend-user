import { Suspense, useEffect, useState } from 'react';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar';
import { ProviderList } from './components/ProviderList';
import { useProviderSidebar } from './hook/useProviderSidebar';
import { ProviderHeader } from './components/ProviderHeader';
import { useAuthState } from '../../../../../data';
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
	return (
		<main className={`provider ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ProviderHeader
					bannerImg="https://t4.ftcdn.net/jpg/02/71/29/75/360_F_271297554_0DAlzyFb8jzYg0lfmUOzyhtMer0orz4h.jpg"
					profileMedia="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwcGVyc29ufGVufDB8fDB8fHww"
					name={`${getUserdata().name} ${getUserdata().lastName}`}
					providerTitle={getUserdata().companyRole}
					memberTime="November 2023"
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
