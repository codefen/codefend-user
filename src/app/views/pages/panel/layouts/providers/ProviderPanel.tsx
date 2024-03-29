import { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router';

import { ProviderSidebar } from './components/sidebar/ProviderSidebar';
import { ProviderList } from './components/ProviderList';
import { ProviderHeader } from './components/ProviderHeader';
import { useShowScreen } from '../../../../../data';
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
			<section className="right">
				<ProviderList />
			</section>
		</main>
	);
};
