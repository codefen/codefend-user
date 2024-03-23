import { type FC } from 'react';
import { RefreshButton, GenerateReportButton } from '../../../../../components';

interface ReportButtonProps {
	onClick: () => void;
}

export const ReportButton: FC<ReportButtonProps> = ({ onClick }) => {
	return (
		<div className="report-btn-container">
			<RefreshButton action={onClick} />
			<GenerateReportButton action={onClick} />
		</div>
	);
};
