import React, { useEffect, useState } from 'react';

import DashboardSearchbar from './components/DashboardSearchbar';
import DashboardCollaborators from './components/DashboardCollaborators';
import DashboardAssets from './components/DashboardAssets';
import DashboardVulnerabilities from './components/DashboardVulnerabilities';

import { IssuesShare, useDashboard } from '../../../../../data';
import {
	VulnerabilityRisk,
	VulnerabilitiesStatus,
} from '../../../../components';
import '../../../../styles/flag.scss';
import './dashboard.scss';

const Dashboard = () => {
	const { isLoading, companyData, refetch } = useDashboard();
	const [showScreen, setShowScreen] = useState(false);

	useEffect(() => {
		refetch();
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<main className={`dashboard ${showScreen ? 'actived' : ''}`}>
			<section className="left">
				<DashboardSearchbar />
				<DashboardVulnerabilities
					isLoading={isLoading}
					topVulnerabilities={companyData.issues ?? []}
				/>
				<DashboardAssets resources={companyData.resources ?? {}} />
				<DashboardCollaborators
					isLoading={isLoading}
					members={companyData.members ?? []}
				/>
			</section>

			<section className="right">
				<VulnerabilityRisk
					vulnerabilityByRisk={
						companyData.issuesShare ?? ({} as IssuesShare)
					}
					isLoading={isLoading}
				/>
				<VulnerabilitiesStatus
					vulnerabilityByShare={companyData.issuesCondition ?? {}}
				/>
			</section>
		</main>
	);
};

export default Dashboard;
