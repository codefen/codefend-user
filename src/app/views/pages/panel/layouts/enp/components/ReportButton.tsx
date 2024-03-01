import { RefreshButton, GenerateReportButton } from '../../../../../components';
import React, { useEffect, useState } from 'react';
import { IoReload } from 'react-icons/io5';

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
