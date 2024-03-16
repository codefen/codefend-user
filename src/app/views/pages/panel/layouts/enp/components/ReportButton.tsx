import React from 'react';
import { RefreshButton, GenerateReportButton } from '../../../../../components';

interface Props {
	onClick: () => void;
}

export const ReportButton: React.FC<Props> = ({ onClick }) => {
	return (
		<div className="report-btn-container">
			<RefreshButton action={onClick} />
			<GenerateReportButton action={onClick} />
		</div>
	);
};
