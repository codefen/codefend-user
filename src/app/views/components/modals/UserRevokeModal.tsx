import { type FC } from 'react';
import { ConfirmModal, ModalTitleWrapper } from '.';
import { useUserRevoke } from '#commonUserHooks/useUserRevoke';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { useSolvedComunique } from '@panelHooks/comunique/useSolvedComunique';

interface UserRevokeModalProps {
  userID: string;
  name: string;
  onDone: () => void;
}

export const UserRevokeModal: FC<UserRevokeModalProps> = ({ userID, name, onDone }) => {
  const { revokeAccessUser } = useUserRevoke();
  const { setIsOpen, isOpen, modalId } = useModalStore();

  const revoke = () => {
    revokeAccessUser(userID).then(() => {
      setIsOpen(false);
      onDone();
    });
  };
  const close = () => setIsOpen(false);

  return (
    <ModalTitleWrapper
      type="revoke-modal"
      isActive={modalId == MODAL_KEY_OPEN.REVOKE_USER && isOpen}
      close={close}
      headerTitle="Revoke access">
      <div
        className="web-modal-wrapper internal-tables disable-border"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <ConfirmModal
          header={`Are you sure you want to remove the user ${name} from your organization?`}
          cancelText="Cancel"
          confirmText="Revoke access"
          close={close}
          action={revoke}
        />
      </div>
    </ModalTitleWrapper>
  );
};
