import React, { useEffect } from 'react';
import { ModalWrapper } from '..';
import {
	BugIcon,
	ExecutiveSummaryIcon,
	LocationItem,
	PageLoader,
	RiskScore,
} from '../..';
import {
	IssuesShare,
	ReportIssues,
	Resouce,
	WebReport,
	Webresources,
	cleanHTML,
	formatDate,
	issuesColumnsWithoutAction,
	useIssueReport,
	useNewWindows,
	useReportInfoStore,
	useReportStore,
	webResourcesWithoutActions,
} from '../../../../data';
import { TableWithoutActions } from '../../Table/TableWithoutActions';
import { RiskWithoutAction } from './components/RiskWithoutAction';
import './reports.scss';
import { CustomReport } from './components/CustomReport';

export interface WebReportModalProps {}

export const ModalReport: React.FC<WebReportModalProps> = () => {
	const { open, closeModal } = useReportStore((state) => state);

	const { isLoading } = useReportInfoStore((state) => state);

	const { fetchReport, xhr } = useIssueReport();

	useEffect(() => {
		if (open && !isLoading) fetchReport();

		return () => {
			xhr.abort();
		};
	}, [open]);

	if (open) {
		return (
			<ModalWrapper action={closeModal} type="report">
				<CustomReport isModal />
			</ModalWrapper>
		);
	} else {
		return <div></div>;
	}
};