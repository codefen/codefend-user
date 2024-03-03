import React, { useEffect, useMemo, useState } from 'react';
import { Issues, useIssues } from '../../../../../../data';
import {
	PrimaryButton,
	VulnerabilitiesStatus,
	VulnerabilityRisk,
} from '../../../../../components';
import { IssueReport } from '../components/IssueReport';
import { IssueResources } from '../components/IssueResources';
import { useFlashlight } from '../../../FlashLightContext';

const IssuesPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [control, refresh] = useState(false);
	const [filters, setFilters] = useState<Set<string>>(new Set([]));
	const { getIssues, isLoading, refetchAll } = useIssues();
	const flashlight = useFlashlight();

	useEffect(() => {
		refetchAll();
		setShowScreen(false);
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
		}, 75);

		return () => clearTimeout(timeoutId);
	}, [control]);

	const handleIssuesFilter = useMemo(() => {
		const isFiltered = filters.size !== 0;
		if (!isFiltered) return { isFiltered };

		const filteredData = getIssues()?.issues.filter((issue: Issues) =>
			filters.has(issue.resourceClass),
		);

		return { filteredData, isFiltered };
	}, [filters, getIssues()]);

	const handleFilters = (issueClass: string) => {
		if (filters.has(issueClass)) {
			const updated = new Set(filters);
			updated.delete(issueClass);
			setFilters(updated);
		} else {
			setFilters((state) => new Set([...state, issueClass]));
		}
	};
	return (
		<>
			<main className={`issues-list ${showScreen ? 'actived' : ''}`}>
				<div className="brightness variant-1"></div>
				<section className="left">
					<IssueResources
						isLoading={isLoading}
						issues={
							handleIssuesFilter.isFiltered
								? handleIssuesFilter.filteredData
								: getIssues()?.issues ?? []
						}
						refresh={() => refresh(!control)}
					/>
				</section>
				<section className="right" ref={flashlight.rightPaneRef}>
					<IssueReport
						handleFilter={handleFilters}
						isLoading={isLoading}
						issuesClasses={getIssues()?.issueClass ?? {}}
					/>
					<PrimaryButton
						text="GENERATE REPORT"
						click={() => alert('Generating report')}
						className="primary-full both"
					/>

					<VulnerabilityRisk
						isLoading={isLoading}
						vulnerabilityByRisk={getIssues()?.issueShare ?? {}}
					/>
					<VulnerabilitiesStatus
						vulnerabilityByShare={getIssues()?.issueCondition ?? {}}
					/>
				</section>
			</main>
		</>
	);
};

export default IssuesPanel;
