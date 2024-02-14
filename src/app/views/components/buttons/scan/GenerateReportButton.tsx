import React from 'react';
import { Show } from '../..';
import '../buttons.scss';

interface ReportButtonProps {
	action: () => void;
}

export const GenerateReportButton: React.FC<ReportButtonProps> = (props) => {
	return (
		<button className="btn scan-btn" onClick={props.action}>
			<p>GENERATE REPORT</p>
		</button>
	);
};
