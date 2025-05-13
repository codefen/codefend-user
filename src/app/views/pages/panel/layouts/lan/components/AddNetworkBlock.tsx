import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { NetworkIcon } from '@icons';
import useModalStore from '@stores/modal.store';

export default function AddNetworkBlock() {
  const { setIsOpen, setModalId } = useModalStore();
  return (
    <div className="card title">
      <div className="header">
        <NetworkIcon />
        <span>Network Infrastructure</span>
      </div>
      <div className="content">
        <p>
          Evaluate the security of your organization's network infrastructure by simulating
          real-world attack scenarios and identifying vulnerabilities in your network setup.
        </p>
        <div className="actions">
          <PrimaryButton
            text="Add Network Component"
            className="btn-black"
            disabledLoader={true}
            click={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_NETWORK);
            }}
          />
          <PrimaryButton
            text="Add Subnetwork"
            className="btn-black"
            disabledLoader={true}
            click={() => {
              setIsOpen(true);
              setModalId(MODAL_KEY_OPEN.ADD_SUB_NETWORK);
            }}
          />
        </div>
      </div>
    </div>
  );
}
