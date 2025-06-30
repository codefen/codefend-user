import { type FC } from 'react';
import { type ComponentEventWithChildren, type Device } from '../../../data';
import { GlobeWebIcon } from '@icons';
import { useAddLanV2 } from '@resourcesHooks/network/useAddLanV2';
import { IPValidatedInput } from '@/app/views/components/utils/IPValidatedInput';
import { ModalTextArea } from '@/app/views/components/ModalTextArea/ModalTextArea';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

interface SubNetworkFormProps extends ComponentEventWithChildren {
  internalNetwork: Device[];
}

const SubNetworkForm: FC<SubNetworkFormProps> = ({ close, onDone, children, internalNetwork }) => {
  const { isLoading, refetch, mainDomainId, desc, externalAddress, internalAddress } = useAddLanV2(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );
  const networkResourceSelected = useGlobalFastField('networkResourceSelected');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    refetch();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-input">
        <span className="icon">
          <GlobeWebIcon />
        </span>

        <select
          ref={mainDomainId}
          className="log-inputs modal_info"
          name="mainDomainId"
          required
          defaultValue={networkResourceSelected.get?.id || ''}>
          <option value="" disabled hidden>
            main resource
          </option>
          {internalNetwork.map((resource: any) => (
            <option key={resource.id} value={resource.id}>{`${resource.device_ex_address}`}</option>
          ))}
        </select>
      </div>
      <IPValidatedInput ref={externalAddress} placeholder="external IP" isExternal={true} />
      <IPValidatedInput ref={internalAddress} placeholder="internal IP" required isExternal={false} />
      <ModalTextArea ref={desc} placeholder="short description" maxLength={600} />
      {children(isLoading)}
    </form>
  );
};

export default SubNetworkForm;
