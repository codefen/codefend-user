import { useState } from 'react';
import useModal from '#commonHooks/useModal';
import type { IntelData, LeakedType } from '@interfaces/snsTypes';

export const useLeakedData = () => {
  const [leaked, setLeaked] = useState<IntelData | null>(null);
  const [leakedType, setLeakedType] = useState<LeakedType>('crack');
  const { showModal, setShowModal } = useModal();

  const handleOpenLeakedModal = (leaked: any, type: LeakedType) => {
    setLeaked(leaked);
    setLeakedType(type);
    setShowModal(true);
  };

  const handleCloseLeakedModal = () => {
    setLeaked(null);
    setShowModal(false);
  };

  return {
    leaked,
    leakedType,
    showModal,
    setShowModal,
    handleOpenLeakedModal,
    handleCloseLeakedModal,
  };
};
