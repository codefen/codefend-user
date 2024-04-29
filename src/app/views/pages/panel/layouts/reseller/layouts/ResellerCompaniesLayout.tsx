import { useShowScreen } from '#commonHooks/useShowScreen';
import { useEffect } from 'react';
import { ResellerHeader } from '../components/ResellerHeader';
import '../reseller.scss';
import { useResellerCompanies } from '@userHooks/resellers/useResellerCompanies';
import { ResellerAllCompanies } from '../components/ResellerAllCompanies';
import { ResourceByLocation } from '@standalones/ResourceByLocation';

const ResellerCompaniesLayout = () => {
	const [showScreen] = useShowScreen();

	const [companies, { getResellerCompanies, isLoading }] =
		useResellerCompanies();

	useEffect(() => {
		getResellerCompanies();
	}, []);

	return (
		<main className={`reseller ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<ResellerHeader />
				<div className="reseller-tables table-companies">
					<ResellerAllCompanies
						isLoading={isLoading}
						companies={companies.current}
					/>
				</div>
			</section>
			<section className="right">
				<ResourceByLocation
					resource={companies.current}
					isLoading={isLoading}
					type="g"
					title="Companies by location"
				/>
			</section>
		</main>
	);
};
export default ResellerCompaniesLayout;
