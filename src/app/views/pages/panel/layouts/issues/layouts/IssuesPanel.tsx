import { type FC, useEffect, useMemo, useState } from 'react';
import {
	useIssueReport,
	type Issues,
	useIssues,
	useReportStore,
	useShowScreen,
} from '../../../../../../data';
import {
	PrimaryButton,
	VulnerabilitiesStatus,
	VulnerabilityRisk,
} from '../../../../../components';
import { IssueReport } from '../components/IssueReport';
import { IssueResources } from '../components/IssueResources';
import { useFlashlight } from '../../../FlashLightContext';

const IssuesPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const [filters, setFilters] = useState<string[]>([]);
	const { getIssues, isLoading, refetchAll } = useIssues();
	const { fetchReport } = useIssueReport();
	const { setResourceID, setResourceType } = useReportStore((state) => state);
	const flashlight = useFlashlight();

	useEffect(() => {
		refetchAll();
	}, [control]);

	const handleIssuesFilter = useMemo(() => {
		const isFiltered = filters.length !== 0;
		if (!isFiltered) return { isFiltered };

		const filteredData = getIssues()?.issues.filter((issue: Issues) =>
			filters.includes(issue.resourceClass),
		);

		return { filteredData, isFiltered };
	}, [filters, getIssues()]);

	const handleFilters = (issueClass: string) => {
		if (filters.includes(issueClass)) {
			const updated = filters.filter((filter) => filter !== issueClass);
			setFilters(updated);
		} else {
			setFilters([...filters, issueClass]);
		}
	};

	const createInform = () => {
		const issue = handleIssuesFilter.filteredData
			? handleIssuesFilter.filteredData[1].resourceID
			: '';

		setResourceID(issue);
		setResourceType('web');
		fetchReport();
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
						refresh={refresh}
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
						click={() => createInform()}
						className="primary-full both"
						isDisabled={filters.length !== 1 || filters[0] !== 'web'}
						disabledLoader
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
