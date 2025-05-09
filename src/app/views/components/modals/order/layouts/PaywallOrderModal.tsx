import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import useModalStore from '@stores/modal.store';
import { useOrderStore } from '@stores/orders.store';
import { useWelcomeStore } from '@stores/useWelcomeStore';
import { useState } from 'react';

export const PaywallOrderModal = ({ close }: any) => {
  const [checkedOption, setCheckedOption] = useState(UserPlanSelected.NOTHING);
  const { updateState } = useOrderStore(state => state);
  const { initialDomain } = useWelcomeStore();
  const { setIsOpen, setModalId } = useModalStore();
  const goTo = () => {
    if (checkedOption === UserPlanSelected.NOTHING) return;
    updateState('paywallSelected', checkedOption);
    if (checkedOption === UserPlanSelected.NORMAL_ORDER) {
      updateState('orderStepActive', OrderSection.SCOPE);
    } else if (checkedOption === UserPlanSelected.ON_DEMAND) {
      updateState('orderStepActive', OrderSection.PAYWALL);
      updateState('open', false);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
    } else {
      updateState('orderStepActive', OrderSection.SMALL_PLANS);
    }
  };
  return (
    <div className="paywall-container">
      <div className="step-header">
        <h3>¡Has alcanzado un maximo!</h3>
      </div>
      <p className="padding">
        Gracias por probar nuestros sistemas, vos o tu empresa <b>han alcanzado un límite</b> y la
        acción que estás intentando realizar requiere la contratación de alguno de nuestros planes o
        servicios.
      </p>
      <div className="step-content">
        <div
          className={`option ${checkedOption === UserPlanSelected.NORMAL_ORDER ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.NORMAL_ORDER)}>
          <input
            id="normal-order"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserPlanSelected.NORMAL_ORDER}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Realizar un pentest manual sobre {initialDomain}</p>
            </div>
            <span className="one-pentest">
              Hackers profesionales conduciran extensas pruebas de penetracion durante
              aproximadamente 3 semanas. Precios desde $1,500{' '}
            </span>
          </label>
        </div>
        <div
          className={`option ${checkedOption === UserPlanSelected.ON_DEMAND ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.ON_DEMAND)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserPlanSelected.ON_DEMAND}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Necesito añadir o analizar otro recurso</p>
            </div>
            <span className="one-pentest">
              Vuelve a la pantalla de seleccion de recursos para que puedas añadir o seleccionar el
              recurso que quieras analizar.
            </span>
          </label>
        </div>
        {/*        <div
          className={`option ${checkedOption === UserPlanSelected.SMALL_P ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.SMALL_P)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserPlanSelected.SMALL_P}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Ver planes más económicos y suscripciones mensuales</p>
            </div>
            <span className="one-pentest">
              Codefend dispone de membresis a servicios automaticos desde $29 mensuales y
              contrataciones de hackers desde $299 mensuales .
            </span>
          </label>
        </div> */}
      </div>
      <div className="primary-container paywall">
        <PrimaryButton
          text="Cancel"
          click={close}
          className="full"
          buttonStyle="gray"
          disabledLoader
        />
        <PrimaryButton
          text="Procced"
          click={goTo}
          className="full"
          buttonStyle="red"
          disabledLoader
          isDisabled={checkedOption === UserPlanSelected.NOTHING}
        />
      </div>
    </div>
  );
};
