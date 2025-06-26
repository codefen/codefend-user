import { type FC, type FormEvent } from 'react';
import { GlobeWebIcon } from '@icons';
import { type Webresource } from '@interfaces/panel.ts';
import { useAddSubResource } from '@resourcesHooks/web/useAddSubResources.ts';
import type { ComponentEventWithChildren } from '@interfaces/util';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

interface SubDomainFormProps extends ComponentEventWithChildren {
  webResources: Webresource[];
}

const SubDomainForm: FC<SubDomainFormProps> = ({ close, onDone, children, webResources }) => {
  const { handleAddSubResource, isLoading, domainName, mainDomainId } = useAddSubResource(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );
  const webResourceSelected = useGlobalFastField('webResourceSelected');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddSubResource();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-input">
        <span className="icon">
          <div className="codefend-text-red">
            <GlobeWebIcon />
          </div>
        </span>
        <select
          ref={mainDomainId}
          className="log-inputs modal_info"
          name="Main resource"
          id="select-subdomain-resources"
          defaultValue={webResourceSelected.get?.id || ''}
          required>
          <option value="" disabled hidden>
            main resource
          </option>
          {webResources.reverse().map((resource: Webresource) => (
            <option key={resource.id} value={resource.id}>
              {resource.resource_domain}
            </option>
          ))}
        </select>
      </div>

      <ModalInput ref={domainName} placeholder="domain name" required />

      {children(isLoading)}
    </form>
  );
};

export default SubDomainForm;
