import { useShowScreen } from '#commonHooks/useShowScreen';
import { ResellerHeader } from '../components/ResellerHeader';
import { ResellerAllLeads } from '../components/ResellerAllLeads';
import { NewLeadsData } from '../components/NewLeadsData';
import { ResourceByLocation } from '../../../../../components/standalones/ResourceByLocation';
import { useEffect } from 'react';
import { useResellerLeads } from '@userHooks/resellers/useResellerLeads';
import '../reseller.scss';

const ResellerLeadsLayout = () => {
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
				<ResourceByLocation
					resource={leads.current}
					isLoading={isLoadingLeads}
					type="lead"
					title="Leads by location"
				/>
			</section>
		</main>
	);
};

export default ResellerLeadsLayout;
