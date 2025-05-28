import { MODAL_KEY_OPEN, RESOURCE_CLASS } from '@/app/constants/app-texts';
import { ResourceNavigate } from '@/app/views/components/ResourceNavigate/ResourceNavigate';
import Show from '@/app/views/components/Show/Show';
import { ModalWrapper } from '@modals/index';
import useModalStore from '@stores/modal.store';
import css from './addnewresource.module.scss';
import { CubeIcon, SnbIcon } from '@icons';

export const AddNewResourceModal = () => {
  const { isOpen, modalId, setIsOpen, setModalId } = useModalStore();

  const handleClose = () => {
    setIsOpen(false);
    setModalId('');
  };

  return (
    <Show when={isOpen && modalId === MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES}>
      <ModalWrapper action={handleClose} showCloseBtn type={css['add-new-resource-modal']}>
        <h1>
          <img src="/codefend/cube.png" width="64" height="64" alt="cube icon" /> Resource selection
          menu
        </h1>
        <p className={css['main-text']}>
          Please select below the type of resource you wish to view, add, or pentest:
        </p>
        <div className={css['resources-container']}>
          <ResourceNavigate
            to="/web"
            title="Web resources"
            description="Manage web resources, such as websites, webapps or apps."
            icon={RESOURCE_CLASS.WEB}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/mobile"
            title="Mobile resources"
            description="Manage your mobile applications you want to pentest."
            icon={RESOURCE_CLASS.MOBILE}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/network"
            title="Network resources"
            description="External and internal IP addresses of any device."
            icon={RESOURCE_CLASS.LAN_NET}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/social"
            title="Social resources"
            description="Manage your staff to conduct social engineering attacks."
            icon={RESOURCE_CLASS.SOCIAL}
            callback={handleClose}
          />
        </div>
      </ModalWrapper>
    </Show>
  );
};
