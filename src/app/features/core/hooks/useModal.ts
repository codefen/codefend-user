import { useState } from 'react';

const useModal = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalStr, setShowModalStr] = useState<string>('');

  return { showModal, setShowModal, showModalStr, setShowModalStr };
};

export default useModal;
