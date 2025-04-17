import { PrimaryButton } from '@buttons/index';
import { CheckIcon } from '@icons';
import { OrderPaymentMethod, OrderSection, UserSmallPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useState } from 'react';

export const SmallPlanOrderModal = () => {
  const [checkedOption, setCheckedOption] = useState(UserSmallPlanSelected.NOTHING);
  const { updateState } = useOrderStore(state => state);

  const goTo = () => {
    if (checkedOption !== UserSmallPlanSelected.NOTHING) {
      updateState('orderStepActive', OrderSection.ANY_PAYMENT_METHOD);
      updateState('paymentMethod', OrderPaymentMethod.CARD);
      updateState('userSmallPlanSelected', checkedOption);
    }
  };

  return (
    <div className="paywall-container">
      <div className="step-header">
        <h3>Planes pequeños!</h3>
      </div>
      <p className="padding">
        Nuestros planes pequeños exclusivos para aplicaciones web ofrecen una combinación única de
        scanners automáticos, aplicando AI para el procesamiento de datos, asistencia técnica
        especializada por pentesters profesionales y búsqueda de dataleaks. Todos brindan acceso
        ilimitado a la plataforma con creación de informes y visualización de issues ilimitados.
      </p>
      <div className="step-content-gird">
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.BASIC ? 'selected-card' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.BASIC)}
          style={{ '--bg-price': 'rgb(250 204 21 / 1)' } as any}>
          {/* Price Badge */}
          <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div>
          <div className="pricing-list-items">
            <h4>Web android basic</h4>

            <ul>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Visualización de issues: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Generación de informes: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Ask a hacker 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Neuroscans 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Data leaks lookups 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Dominios máximos 🛈: 3</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.ADVANCED ? 'selected-card' : ''}`}
          style={{ '--bg-price': 'rgb(52 211 153 / 1)' } as any}
          onClick={() => setCheckedOption(UserSmallPlanSelected.ADVANCED)}>
          {/* Price Badge */}
          <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div>
          <div className="pricing-list-items">
            <h4>Web android basic</h4>

            <ul>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Visualización de issues: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Generación de informes: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Ask a hacker 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Neuroscans 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Data leaks lookups 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Dominios máximos 🛈: 3</span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.MEDIUM ? 'selected-card' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.MEDIUM)}
          style={{ '--bg-price': 'rgb(251 146 60 / 1)' } as any}>
          {/* Price Badge */}
          <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div>
          <div className="pricing-list-items">
            <h4>Web android basic</h4>

            <ul>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Visualización de issues: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Generación de informes: ilimitada</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Ask a hacker 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Neuroscans 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Data leaks lookups 🛈: 5 al mes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckIcon />
                <span>Dominios máximos 🛈: 3</span>
              </li>
            </ul>
          </div>
        </div>
        {/*        <div
          className={`option ${checkedOption === UserSmallPlanSelected.MEDIUM ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.MEDIUM)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserSmallPlanSelected.MEDIUM}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Web android basic</p>
            </div>
            <span className="one-pentest">
              Visualización de issues: ilimitada Generación de informes: ilimitada Ask a hacker 🛈: 5
              al mes Neuroscans 🛈: 5 al mes Data leaks lookups 🛈: 5 al mes Dominios máximos 🛈: 3 $29
              usd mensuales
            </span>
          </label>
        </div>
        <div
          className={`option ${checkedOption === UserSmallPlanSelected.BASIC ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.BASIC)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserSmallPlanSelected.BASIC}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Web android medium</p>
            </div>
            <span className="one-pentest">
              Visualización de issues: ilimitada Generación de informes: ilimitada Ask a hacker 🛈:
              10 al mes Neuroscans 🛈: 10 al mes Data leaks lookups 🛈:10 al mes Dominios máximos 🛈: 6
              $59 usd mensuales
            </span>
          </label>
        </div>
        <div
          className={`option ${checkedOption === UserSmallPlanSelected.ADVANCED ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.ADVANCED)}>
          <input
            id="scope-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserSmallPlanSelected.ADVANCED}
            onChange={() => {}}
          />
          <div className="codefend-radio"></div>

          <label htmlFor="scope-resources" className="order-snapshot">
            <div className="top">
              <p>Web android advanced</p>
            </div>
            <span className="one-pentest">
              Visualización de issues: ilimitada Generación de informes: ilimitada Ask a hacker 🛈:
              20 al mes Neuroscans 🛈: 20 al mes Data leaks lookups 🛈: 20 al mes Dominios máximos 🛈:
              12 $89 usd mensuales
            </span>
          </label>
        </div> */}
      </div>
      <div className="primary-container paywall">
        <PrimaryButton
          text="Dame todo tu guita ACA!"
          className="full"
          click={goTo}
          buttonStyle="red"
          disabledLoader
          isDisabled={checkedOption === UserSmallPlanSelected.NOTHING}
        />
      </div>
    </div>
  );
};
