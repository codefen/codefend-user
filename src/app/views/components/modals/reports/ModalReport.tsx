import React from 'react';
import { ModalWrapper } from '..';

import { useReportStore, webResourcesWithoutActions } from '../../../../data';
import './reports.scss';
import { CustomReport } from './components/CustomReport';

export interface WebReportModalProps {}

export const ModalReport: React.FC<WebReportModalProps> = () => {
	const { open, closeModal } = useReportStore((state) => state);
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
