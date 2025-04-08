import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import Show from '@/app/views/components/Show/Show';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import useModalStore from '@stores/modal.store';
import css from './paywall.module.scss';

export const PaywallModal = () => {
  const { modalId, isOpen, setIsOpen } = useModalStore();
  return (
    <Show when={modalId === MODAL_KEY_OPEN.PAYWALL && isOpen}>
      <ModalWrapper action={() => setIsOpen(false)} showCloseBtn type={css['container']}>
        <div>
          DAME TODA LA GUITA:
          <input placeholder="Numero de tarjeta" />
          <PrimaryButton text="Enviar" buttonStyle="red" />
        </div>
      </ModalWrapper>
    </Show>
  );
};
