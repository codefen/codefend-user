import React from 'react';
import { CustomReport } from './components/CustomReport';
import { useReportInfoStore } from '../../../../data';

export const PageReport = () => {
	return <CustomReport forceOpen />;
};
