import { type FC, type FormEvent } from 'react';
import { useAddWebResource } from '@resourcesHooks/web/useAddWebResources';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';

const WebDomainForm: FC<ComponentEventWithChildren> = ({ onDone, close, children }) => {
  const { handleAddResource, isLoading, domainName, subdomain_scan } = useAddWebResource(
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
      <div className="checkbox-container">
        <input
          ref={subdomain_scan}
          type="checkbox"
          id="subdomain_scan"
          name="subdomain_scan"
          className="codefend-checkbox"
        />
        <label htmlFor="subdomain_scan">Automatic subdomain detection</label>
      </div>
      {children(isLoading)}
    </form>
  );
};

export default WebDomainForm;
