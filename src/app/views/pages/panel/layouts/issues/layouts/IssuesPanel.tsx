import React, { useEffect, useMemo, useState } from 'react';
import { Issues, useIssues } from '../../../../../../data';
import {
	PrimaryButton,
	VulnerabilitiesStatus,
	VulnerabilityRisk,
} from '../../../../../components';
import { IssueReport } from '../components/IssueReport';
import { IssueResources } from '../components/IssueResources';

const IssuesPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [control, refresh] = useState(false);
	const [filters, setFilters] = useState<Set<string>>(new Set([]));
	const { getIssues, isLoading, refetchAll } = useIssues();

	useEffect(() => {
		refetchAll();
		setShowScreen(false);
		const timeoutId = setTimeout(() => {
			setShowScreen(true);
		}, 75);

		return () => clearTimeout(timeoutId);
	}, [control]);

	/* 	
	//Run the effect to refresh when changing the route 
	// (It would be used to navigate VulnerabilityStatus)
	const location = useLocation();
	useUpdateEffect(() => {
		refresh(!control);
	}, [location]);
	*/
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
				<section className="right">
					<VulnerabilityRisk
						isLoading={isLoading}
						vulnerabilityByRisk={getIssues()?.issueShare ?? {}}
					/>
					<VulnerabilitiesStatus
						vulnerabilityByShare={getIssues()?.issueCondition ?? {}}
					/>
					<PrimaryButton
						text="GENERATE REPORT"
						click={(e) => alert('Generating report')}
						className="w-full mt-4 mb-4"
					/>
					<IssueReport
						handleFilter={handleFilters}
						isLoading={isLoading}
						issuesClasses={getIssues()?.issueClass ?? {}}
					/>
				</section>
			</main>
		</>
	);
};

export default IssuesPanel;
