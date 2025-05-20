import { type FC, useCallback } from 'react';
import { ConfirmModal, ModalTitleWrapper } from '.';
import { useUserData } from '#commonUserHooks/useUserData';
import useModalStore from '@stores/modal.store';
import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import { useFetcher } from '#commonHooks/useFetcher';
import { apiErrorValidation } from '@/app/constants/validations';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

interface DeleteMobileCloudModalProps {
  onDone: (id: string) => void;
  app: any;
}

export const DeleteMobileCloudModal: FC<DeleteMobileCloudModalProps> = ({ onDone, app }) => {
  const { setIsOpen, isOpen, modalId } = useModalStore();
  const { getCompany } = useUserData();
  const [fetcher] = useFetcher();
  const companyId = getCompany();

  const closeModal = () => setIsOpen(false);

  const action = useCallback(() => {
    fetcher('post', {
      body: {
        company_id: companyId,
        id: app?.id,
      },
      path: `resources/${RESOURCE_CLASS.MOBILE}/del`,
    }).then(({ data }: any) => {
      if (apiErrorValidation(data)) {
        toast.error(data?.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR);
        return;
      }
      setIsOpen(false);
      onDone?.(app?.id);
    });
  }, [companyId, app?.id]);

  const headerTitle = `Are you sure to remove mobile app \n  ${app?.app_name || app?.cloud_name}`;

  return (
    <ModalTitleWrapper
      isActive={isOpen && modalId === MODAL_KEY_OPEN.DELETE_APP}
      close={closeModal}
      headerTitle="Delete mobile app">
      <div
        className="web-modal-wrapper internal-tables disable-border"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
        <ConfirmModal
          header={headerTitle}
          cancelText="Cancel"
          confirmText="Delete"
          close={closeModal}
          action={action}
        />
      </div>
    </ModalTitleWrapper>
  );
};
