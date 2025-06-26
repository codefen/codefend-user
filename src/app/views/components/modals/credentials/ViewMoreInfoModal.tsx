import Show from '@/app/views/components/Show/Show';
import type { ResourceCredential } from '@interfaces/creds';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import type { FC } from 'react';

interface ViewMoreInfoModalProps {
  credential?: ResourceCredential;
  close: () => void;
  isOpen: boolean;
}

export const ViewMoreInfoModal: FC<ViewMoreInfoModalProps> = ({ credential, close, isOpen }) => (
  <Show when={isOpen}>
    <ModalWrapper action={close} type="credential-extra-info" showCloseBtn>
      <div className="modal-content">
        <h3>Credential Info</h3>
        <p>{credential?.info || 'Not found'}</p>
      </div>
    </ModalWrapper>
  </Show>
);
