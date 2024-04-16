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
	const [reseller, { getResellerProfile, isLoading: isLoadingReseller }] =
		useResellerDashboard();
	const [leads, { getResellerLeads, isLoading: isLoadingLeads }] =
		useResellerLeads();
	const [companies, { getResellerCompanies, isLoading: isLoadingCompanies }] =
		useResellerCompanies();
	const [orders, { getResellerOrders, isLoading: isLoadingOrders }] =
		useResellerOrders();

	useEffect(() => {
		getResellerProfile();
		getResellerLeads();
		getResellerCompanies();
		getResellerOrders();
	}, []);

	const assets = [
		{
			value: '970',
			title: 'Total companies',
		},
		{
			value: '2650',
			title: 'Total Users',
		},
		{
			value: '1282',
			title: 'Total Orders',
		},
	];
	const location = [
		{
			serverCountryCode: 'sa',
			serverCountry: 'Saudi Arabia',
		},
		{
			serverCountryCode: 'ba',
			serverCountry: 'Bahrain',
		},
		{
			serverCountryCode: 'ua',
			serverCountry: 'United Arab Emirates',
		},
		{
			serverCountryCode: 'qt',
			serverCountry: 'Qatar',
		},
		{
			serverCountryCode: 'ku',
			serverCountry: 'Kuwait',
		},
	];
	return (
		<main className={`reseller ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ResellerHeader />
				<div className="reseller-assets">
					<ResellerAssetsStats assets={assets} assetsKey="left" />
					<ResellerGraph />
				</div>
				<div className="reseller-tables">
					<ResellerAllLeads leads={leads.current} />
				</div>
			</section>
			<section className="right">
				<NewLeadsData />
				<ResellerByLocation locationResource={location} isLoading={false} />
			</section>
		</main>
	);
};
