import { useShowScreen } from '#commonHooks/useShowScreen';
import { ResellerHeader } from './components/ResellerHeader';
import './reseller.scss';
import { ResellerAssetsStats } from './components/ResellerAssetsStats';
import { ResellerGraph } from './components/ResellerGraph';
import { ResellerAllLeads } from './components/ResellerAllLeads';
import { NewLeadsData } from './components/NewLeadsData';
import { ResellerByLocation } from './components/ResellerByLocation';
import { useResellerDashboard } from '@userHooks/resellers/useResellerDashboard';
import { useEffect } from 'react';
import { useResellerLeads } from '@userHooks/resellers/useResellerLeads';
import { useResellerCompanies } from '@userHooks/resellers/useResellerCompanies';
import { useResellerOrders } from '@userHooks/resellers/useResellerOrders';

export const ResellerPage = () => {
	const [showScreen] = useShowScreen();
	//const [reseller, { getResellerProfile, isLoading: isLoadingReseller }] =
	//	useResellerDashboard();
	const [leads, { getResellerLeads, isLoading: isLoadingLeads }] =
		useResellerLeads();
	//const [companies, { getResellerCompanies, isLoading: isLoadingCompanies }] =
	//	useResellerCompanies();
	//const [orders, { getResellerOrders, isLoading: isLoadingOrders }] =
	//	useResellerOrders();

	useEffect(() => {
		getResellerLeads();

		let iframes = document.querySelectorAll('iframe');
		iframes.forEach((iframe) => {
			if (iframe.parentNode) {
				iframe.parentNode.removeChild(iframe);
			}
		});
		return () => {
			let iframes = document.querySelectorAll('iframe');
			iframes.forEach((iframe) => {
				if (iframe.parentNode) {
					iframe.parentNode.removeChild(iframe);
				}
			});
		};
	}, []);

	return (
		<main className={`reseller ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ResellerHeader />
				<div className="reseller-tables">
					<ResellerAllLeads leads={leads.current} />
				</div>
			</section>
			<section className="right">
				<NewLeadsData leads={leads.current} />
				<ResellerByLocation locationResource={[]} isLoading={false} />
			</section>
		</main>
	);
};
