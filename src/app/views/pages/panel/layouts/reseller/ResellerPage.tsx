import { useShowScreen } from '#commonHooks/useShowScreen';
import { ResellerHeader } from './components/ResellerHeader';
import './reseller.scss';
import { ResellerAssetsStats } from './components/ResellerAssetsStats';
import { ResellerGraph } from './components/ResellerGraph';
import { ResellerAllLeads } from './components/ResellerAllLeads';
import { NewLeadsData } from './components/NewLeadsData';
import { ResellerByLocation } from './components/ResellerByLocation';

export const ResellerPage = () => {
	const [showScreen] = useShowScreen();
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
					<ResellerAllLeads />
				</div>
			</section>
			<section className="right">
				<NewLeadsData />
				<ResellerByLocation locationResource={location} isLoading={false} />
			</section>
		</main>
	);
};
