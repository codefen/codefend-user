import { type FC } from 'react';
import { RefreshButton } from '@buttons/scan/RefreshButton';
import { GenerateReportButton } from '@buttons/scan/GenerateReportButton';

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
