import { type FC } from 'react';
import { ModalWrapper } from '..';

import { CustomReport } from './CustomReport';
import './reports.scss';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

export interface WebReportModalProps {}

export const ModalReport: FC<WebReportModalProps> = () => {
  const openModal = useGlobalFastField('openModal');
  if (openModal.get) {
    return (
      <ModalWrapper action={() => openModal.set(false)} type="report" showCloseBtn>
        <CustomReport isModal />
      </ModalWrapper>
    );
  } else {
    return null;
  }
};
