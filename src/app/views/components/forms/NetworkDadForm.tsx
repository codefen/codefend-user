import { type FC, type FormEvent } from 'react';

import { useAddLan } from '@resourcesHooks/network/useAddLan';
import { ModalTextArea } from '@/app/views/components/ModalTextArea/ModalTextArea';
import { IPValidatedInput } from '@/app/views/components/utils/IPValidatedInput';
import type { ComponentEventWithChildren } from '@interfaces/util';

export const NetworkDadForm: FC<ComponentEventWithChildren> = ({ onDone, close, children }) => {
  const { isLoading, refetch, internalAddress, externalAddress, desc } = useAddLan(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    refetch();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <IPValidatedInput ref={externalAddress} placeholder="External IP Address" required />
      <IPValidatedInput ref={internalAddress} placeholder="Internal IP Address" required />

      <ModalTextArea ref={desc} placeholder="short description" maxLength={512} required />
      {children(isLoading)}
    </form>
  );
};
