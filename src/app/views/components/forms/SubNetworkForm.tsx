import { type FC } from 'react';
import { type ComponentEventWithChildren, type Device } from '../../../data';
import { GlobeWebIcon } from '@icons';
import { useAddLanV2 } from '@resourcesHooks/network/useAddLanV2';
import { ModalInput } from '@/app/views/components/ModalInput/ModalInput';
import { ModalTextArea } from '@/app/views/components/ModalTextArea/ModalTextArea';

interface SubNetworkFormProps extends ComponentEventWithChildren {
  internalNetwork: Device[];
}

const SubNetworkForm: FC<SubNetworkFormProps> = ({ close, onDone, children, internalNetwork }) => {
  const { isLoading, refetch, mainDomainId, desc, externalAddress, internalAddress } = useAddLanV2(
    onDone ? onDone : () => {},
    close ? close : () => {}
  );

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

        <select ref={mainDomainId} className="log-inputs modal_info" name="mainDomainId" required>
          <option value="0" disabled hidden>
            main resource
          </option>
          {internalNetwork.map((resource: any) => (
            <option key={resource.id} value={resource.id}>{`${resource.device_ex_address}`}</option>
          ))}
        </select>
      </div>
      <ModalInput ref={externalAddress} placeholder="external IP" />
      <ModalInput ref={internalAddress} placeholder="internal IP" required />
      <ModalTextArea ref={desc} placeholder="short description" maxLength={600} />
      {children(isLoading)}
    </form>
  );
};

export default SubNetworkForm;
