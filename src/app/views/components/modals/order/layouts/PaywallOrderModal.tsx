import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { OrderSection } from '@interfaces/order';
import useModalStore from '@stores/modal.store';
import { useOrderStore } from '@stores/orders.store';
import { useState } from 'react';

export const PaywallOrderModal = () => {
  const { setIsOpen, setModalId } = useModalStore();
  const [checkedOption, setCheckedOption] = useState('');
  const { updateState } = useOrderStore(state => state);
  const goTo = () => {
    console.log('checked: ', { checkedOption });
    if (checkedOption === 'noido') {
      updateState('open', false);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_SELECT_RESOURCE);
    } else {
      updateState('orderStepActive', OrderSection.SCOPE);
    }
  };
  return (
    <div>
      <div className="step-header">
        <h3>Llegaste al limite de tu plan</h3>
      </div>
      <p>
        Para continuar, es necesario que contrates uno de nuestros servicios o planes. Estas listo
        para continuar o queres analizar otro recurso?
      </p>
      <div className="step-content">
        <div
          className={`option ${checkedOption === 'yesido' ? 'select-option' : ''}`}
          onClick={() => setCheckedOption('yesido')}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === 'yesido'}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Estoy listo para continuar</p>
            </div>
            <span className="one-pentest">Quiero avanzar con los planes</span>
          </label>
        </div>
        <div
          className={`option ${checkedOption === 'noido' ? 'select-option' : ''}`}
          onClick={() => setCheckedOption('noido')}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === 'noido'}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>No estoy listo para continuar</p>
            </div>
            <span className="one-pentest">Ir a agregar mas recursos</span>
          </label>
        </div>
      </div>
      <div className="primary-container">
        <PrimaryButton text="Ir a" click={goTo} className="full" buttonStyle="red" disabledLoader />
      </div>
    </div>
  );
};
