import { type FC } from 'react';
import '../buttons.scss';

interface ReportButtonProps {
  action: () => void;
}

export const GenerateReportButton: FC<ReportButtonProps> = props => {
  return (
    <button className="btn scan-btn" onClick={props.action}>
      <p>GENERATE REPORT</p>
    </button>
  );
};
