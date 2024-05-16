import { type FC } from 'react';
import { ModalWrapper } from '..';

import { useReportStore } from '../../../../data';
import { CustomReport } from './CustomReport';
import './reports.scss';

export interface WebReportModalProps {}

export const ModalReport: FC<WebReportModalProps> = () => {
	const { open, closeModal } = useReportStore((state) => state);
	if (open) {
		return (
			<ModalWrapper action={closeModal} type="report" showCloseBtn>
				<CustomReport isModal />
			</ModalWrapper>
		);
	} else {
		return <div></div>;
	}
};
