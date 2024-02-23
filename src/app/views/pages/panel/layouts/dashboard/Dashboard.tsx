import React, { useEffect, useState } from 'react';

import DashboardAssets from './components/DashboardAssets';
import DashboardCollaborators from './components/DashboardCollaborators';
import DashboardSearchbar from './components/DashboardSearchbar';
import DashboardVulnerabilities from './components/DashboardVulnerabilities';

import { IssuesShare, useDashboard } from '../../../../../data';
import {
	VulnerabilitiesStatus,
	VulnerabilityRisk,
} from '../../../../components';
import '../../../../styles/flag.scss';
import { useFlashlight } from '../../FlashLightContext';
import './dashboard.scss';

const Dashboard: React.FC = () => {
	const { isLoading, companyData, refetch } = useDashboard();
	const [showScreen, setShowScreen] = useState(false);
	const flashlight = useFlashlight();

	useEffect(() => {
		refetch();
		setShowScreen(false);
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<main className={`dashboard ${showScreen ? 'actived' : ''}`}>
			<div className="brightness variant-1"></div>
			<div className="brightness variant-2"></div>
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

			<section className="right" ref={flashlight.rightPaneRef}>
				<VulnerabilitiesStatus
					vulnerabilityByShare={companyData.issuesCondition ?? {}}
				/>

				<VulnerabilityRisk
					vulnerabilityByRisk={
						companyData.issuesShare ?? ({} as IssuesShare)
					}
					isLoading={isLoading}
				/>
			</section>
		</main>
	);
};

export default Dashboard;
