import { Suspense } from 'react';
import { Outlet } from 'react-router';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar.tsx';
import { ProviderList } from './components/ProviderList.tsx';
import { ProviderHeader } from './components/ProviderHeader.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import './provider.scss';

export const ProviderPage = () => {
	const [showScreen] = useShowScreen();
	return (
		<main className={`provider ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ProviderHeader />
				<div className="provider-content">
					<ProviderSidebar />
					<div className="provider-main-content">
						<Suspense>
							<Outlet />
						</Suspense>
					</div>
				</div>
			</section>
		</main>
	);
};
