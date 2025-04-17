import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import useModalStore from '@stores/modal.store';
import { useOrderStore } from '@stores/orders.store';
import { useState } from 'react';

export const PaywallOrderModal = ({ close }: any) => {
  const [checkedOption, setCheckedOption] = useState(UserPlanSelected.NOTHING);
  const { updateState } = useOrderStore(state => state);
  const goTo = () => {
    if (checkedOption === UserPlanSelected.NOTHING) return;
    updateState('paywallSelected', checkedOption);
    if (checkedOption === UserPlanSelected.CONTINIOUS) {
      updateState('orderStepActive', OrderSection.ARABIC_PLAN);
    } else if (checkedOption === UserPlanSelected.ON_DEMAND) {
      updateState('orderStepActive', OrderSection.SCOPE);
    } else {
      updateState('orderStepActive', OrderSection.SMALL_PLANS);
    }
  };
  return (
    <div className="paywall-container">
      <div className="step-header">
        <h3>¡Has alcanzado un límite!</h3>
      </div>
      <p className="padding">
        Gracias por probar nuestros sistemas, vos o tu empresa han alcanzado un límite y la acción
        que estás intentando realizar requiere la contratación de alguno de nuestros planes o
        servicios. Tenemos distintas ofertas adaptadas a tus necesidades, por favor seleccioná una.
      </p>
      <div className="step-content">
        <div
          className={`option ${checkedOption === UserPlanSelected.CONTINIOUS ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.CONTINIOUS)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserPlanSelected.CONTINIOUS}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Pentest on demand realizado por hackers profesionales</p>
            </div>
            <span className="one-pentest">
              Conduzca un pentest y pruebas de intrusión sobre los activos y recursos de su
              organización empleando hackers profesionales altamente cualificados para cada caso.
              Desde $1,500 dolares para aplicaciones web y $4,500 para aplicaciones mobile.
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
              <p>Pentest continuo realizado por hackers profesionales</p>
            </div>
            <span className="one-pentest">
              Incluye los servicios previos: monitoreo y detección de amenazas automatizado,
              búsqueda de dataleaks, más la continua revisión de activos realizada por un hacker
              profesional. Desde $299 dólares al mes.
            </span>
          </label>
        </div>
        <div
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
              <p>Planes pequeños</p>
            </div>
            <span className="one-pentest">
              Suscripción mensual a servicios de monitoreo y detección de amenazas automatizado, y
              búsqueda de dataleaks on demand. Ideal para pequeñas empresas que deseen realizar
              pruebas periódicas sobre sus activos. Desde $29 dólares mensuales.
            </span>
          </label>
        </div>
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
