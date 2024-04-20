import React, { useEffect } from 'react';

import DashboardAssets from './components/DashboardAssets.tsx';
import DashboardCollaborators from './components/DashboardCollaborators.tsx';
import DashboardVulnerabilities from './components/DashboardVulnerabilities.tsx';

import { type IssuesShare } from '@interfaces/panel.ts';
import { useDashboard } from '@panelHooks/dashboard/useDashboard.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { useFlashlight } from '../../FlashLightContext.tsx';
import './dashboard.scss';
import { PrimaryButton } from '@buttons/index.ts';
import { useNavigate } from 'react-router';

const Dashboard: React.FC = () => {
	const flashlight = useFlashlight();
	const [showScreen] = useShowScreen();
	const { isLoading, companyData, refetch } = useDashboard();
	const navigate = useNavigate();
	useEffect(() => {
		refetch();
	}, []);

	return (
		<main className={`dashboard ${showScreen ? 'actived' : ''}`}>
			<div className="brightness variant-1"></div>
			<div className="brightness variant-2"></div>

			<section className="left">
				<DashboardVulnerabilities
					isLoading={isLoading}
					topVulnerabilities={companyData.issues || []}
				/>
				<DashboardAssets resources={companyData.resources || {}} />
				<DashboardCollaborators
					isLoading={isLoading}
					members={companyData.members || []}
				/>
			</section>

			<section className="right" ref={flashlight.rightPaneRef}>
				<VulnerabilitiesStatus
					vulnerabilityByShare={companyData.issuesCondition || {}}
				/>
				<PrimaryButton
					text="Go to vulnerabilities"
					buttonStyle="red"
					className="full"
					click={() => navigate('/issues')}
					disabledLoader
				/>
				<VulnerabilityRisk
					vulnerabilityByRisk={companyData.issuesShare || {}}
					isLoading={isLoading}
				/>
			</section>
		</main>
	);
};

export default Dashboard;
