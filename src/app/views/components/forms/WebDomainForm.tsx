import { type FC, type FormEvent } from 'react';
import { useAddWebResource } from '@resourcesHooks/web/useAddWebResources';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { ModalInput } from '@defaults/ModalInput';

const WebDomainForm: FC<ComponentEventWithChildren> = ({ onDone, close, children }) => {
  const { handleAddResource, isLoading, domainName } = useAddWebResource(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddResource();
    return;
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <ModalInput ref={domainName} placeholder="domain name" required />
      {children(isLoading)}
    </form>
  );
};

export default WebDomainForm;
