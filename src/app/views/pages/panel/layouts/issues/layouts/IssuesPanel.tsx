import { type FC, useEffect, useMemo, useState } from 'react';
import { useIssues } from '@panelHooks/issues/useIssues.ts';
import { type Issues } from '@interfaces/panel.ts';
import { useIssueReport } from '@panelHooks/issues/useIssueReports.ts';
import { useReportStore } from '@stores/report.store.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import { VulnerabilitiesStatus } from '@standalones/VulnerabilitiesStatus.tsx';
import { VulnerabilityRisk } from '@standalones/VulnerabilityRisk.tsx';
import { PrimaryButton } from '@buttons/primary/PrimaryButton.tsx';
import { IssueReport } from '../components/IssueReport.tsx';
import { IssueResources } from '../components/IssueResources.tsx';
import { useFlashlight } from '../../../FlashLightContext.tsx';
import { SelectReportTypeModal } from '@modals/reports/SelectReportType.tsx';
import useModalStore from '@stores/modal.store.ts';
import {
	EMPTY_ISSUECLASS,
	EMPTY_ISSUECONDITION,
	EMPTY_SHARE,
} from '@mocks/empty.ts';
import { ModalReport, OrderV2 } from '@modals/index.ts';

const IssuesPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const [filters, setFilters] = useState<string[]>([]);
	const { issues, others, isLoading, refetchAll } = useIssues();
	const { fetchReport } = useIssueReport();
	const { setResourceID, setResourceType } = useReportStore((state) => state);
	const { setIsOpen, setModalId } = useModalStore();
	const flashlight = useFlashlight();

	useEffect(() => {
		refetchAll();
	}, [control]);

	const handleIssuesFilter = useMemo(() => {
		const isFiltered = filters.length !== 0;
		if (!isFiltered) return { filteredData: [], isFiltered };

		const filteredData = issues.filter((issue: Issues) =>
			filters.includes(issue.resourceClass),
		);

		return { filteredData, isFiltered };
	}, [filters, issues]);

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
		<main className={`issues-list ${showScreen ? 'actived' : ''}`}>
			<SelectReportTypeModal
				issues={
					handleIssuesFilter.isFiltered
						? handleIssuesFilter.filteredData
						: issues
				}
			/>
			<ModalReport />
			<div className="brightness variant-1"></div>
			<section className="left">
				<IssueResources
					isLoading={isLoading}
					issues={
						handleIssuesFilter.isFiltered
							? handleIssuesFilter.filteredData
							: issues
					}
					refresh={refresh}
				/>
			</section>
			<section className="right" ref={flashlight.rightPaneRef}>
				<IssueReport
					handleFilter={handleFilters}
					isLoading={isLoading}
					issuesClasses={others?.issueClass || EMPTY_ISSUECLASS}
				/>
				<PrimaryButton
					text="GENERATE REPORT"
					click={(e) => {
						setIsOpen(true);
						setModalId('selectReport');
					}}
					className="primary-full"
					isDisabled={
						!Boolean(issues.length) &&
						!Boolean(handleIssuesFilter.filteredData.length)
					}
					disabledLoader
				/>

				<VulnerabilityRisk
					isLoading={isLoading}
					vulnerabilityByRisk={others?.issueShare || EMPTY_SHARE}
				/>
				<VulnerabilitiesStatus
					vulnerabilityByShare={
						others?.issueCondition || EMPTY_ISSUECONDITION
					}
				/>
			</section>
		</main>
	);
};

export default IssuesPanel;
