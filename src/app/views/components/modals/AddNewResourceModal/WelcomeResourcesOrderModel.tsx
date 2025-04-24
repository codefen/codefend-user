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
          <img src="/codefend/cube.png" width="64" height="64" alt="cube icon" /> Menu de seleccion
          de recursos
        </h1>
        <p className={css['main-text']}>
          Por favor seleccione a continuacion la clase de recurso que desearia visualizar, añadir o
          conducir pruebas:
        </p>
        <div className={css['resources-container']}>
          <ResourceNavigate
            to="/web"
            title="Recursos web"
            description="Administra recursos web, como websites, webapps o apps."
            count={12}
            icon={RESOURCE_CLASS.WEB}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/mobile"
            title="Recursos mobile"
            description="Administra tus aplicaciones moviles que quieras pentestear"
            count={12}
            icon={RESOURCE_CLASS.MOBILE}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/network"
            title="Recursos network"
            description="Direciones IP externas e internas de cualquier dispositivo."
            count={12}
            icon={RESOURCE_CLASS.NETWORK}
            callback={handleClose}
          />
          <ResourceNavigate
            to="/social"
            title="Recursos sociales"
            description="Administra tu personal para conducir ataques sociales."
            count={12}
            icon={RESOURCE_CLASS.SOCIAL}
            callback={handleClose}
          />
        </div>
      </ModalWrapper>
    </Show>
  );
};
