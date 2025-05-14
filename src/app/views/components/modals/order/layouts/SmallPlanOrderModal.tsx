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
      <div className="step-header-maximo-plan3">
        <img src="" alt="" />
        <h3>Automated Plan for Small Businesses</h3>
      </div>
      <p className="padding">
        Exclusive small plans for web applications offer a unique combination of{' '}
        <strong>automated scanners</strong>, specialized technical support, and{' '}
        <strong>data leak detection</strong>. All provide unlimited access to the platform with
        report creation and issue visualization.
      </p>
      <div className="step-content-gird">
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.BASIC ? 'selected-card' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.BASIC)}
          style={{
            backgroundColor: 'white',
            border:
              checkedOption === UserSmallPlanSelected.BASIC
                ? '2px solid var(--secondary-color-50)'
                : '1px solid var(--primary-color-300)',
          }}>
          {/* Price Badge */}
          {/* <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div> */}
          <div className="pricing-list-items">
            <img
              src="public/codefend/IA ICON.png"
              alt="Description of image"
              className="pricing-image small-image"
              style={{ width: '100px', height: 'auto', margin: '0.5rem', display: 'block' }}
            />

            <h4>Basic Machine</h4>

            <ul>
              <li className="flex items-start gap-2">
                <span>Issue visualization: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Report generation: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Ask a hacker: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Neuroscans: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Data leaks lookups: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Max domains: <strong>5 per month</strong>
                </span>
              </li>
              <li className="price">
                <span>
                  Price: <strong>$29 per month</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.ADVANCED ? 'selected-card' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.ADVANCED)}
          style={{
            backgroundColor: 'white',
            border:
              checkedOption === UserSmallPlanSelected.ADVANCED
                ? '2px solid var(--secondary-color-50)'
                : '1px solid var(--primary-color-300)',
          }}>
          {/* Price Badge */}
          {/* <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div> */}
          <div className="pricing-list-items">
            <img
              src="public/codefend/IA ICON.png"
              alt="Description of image"
              className="pricing-image small-image"
              style={{ width: '100px', height: 'auto', margin: '0.5rem', display: 'block' }}
            />

            <h4>Medium Machine</h4>

            <ul>
              <li className="flex items-start gap-2">
                <span>Issue visualization: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Report generation: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Ask a hacker: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Neuroscans: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Data leaks lookups: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Max domains: <strong>3</strong>
                </span>
              </li>
              <li className="price">
                <span>
                  Price: <strong>$59 per month</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`pricing-card ${checkedOption === UserSmallPlanSelected.MEDIUM ? 'selected-card' : ''}`}
          onClick={() => setCheckedOption(UserSmallPlanSelected.MEDIUM)}
          style={{
            backgroundColor: 'white',
            border:
              checkedOption === UserSmallPlanSelected.MEDIUM
                ? '2px solid var(--secondary-color-50)'
                : '1px solid var(--primary-color-300)',
          }}>
          {/* Price Badge */}
          {/* <div className="pricing-card-header">
            <div className="pricing-circle">
              <span className="text-xs">$</span>
              <span className="text-xl">29</span>
              <span className="text-teen">/mes</span>
            </div>
          </div> */}

          <div className="pricing-list-items">
            <img
              src="public/codefend/IA ICON.png"
              alt="Description of image"
              className="pricing-image small-image"
              style={{ width: '100px', height: 'auto', margin: '0.5rem', display: 'block' }}
            />

            <h4>Advanced Machine</h4>

            <ul>
              <li className="flex items-start gap-2">
                <span>Issue visualization: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>Report generation: Unlimited</span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Ask a hacker: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Neuroscans: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Data leaks lookups: <strong>5 per month</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>
                  Max domains: <strong>5 per month</strong>
                </span>
              </li>
              <li className="price">
                <span>
                  Price: <strong>$89 per month</strong>
                </span>
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
          text="Close Asistant"
          className="flex-2"
          click={goTo}
          buttonStyle="gray"
          disabledLoader
          isDisabled={checkedOption === UserSmallPlanSelected.NOTHING}
        />
        <PrimaryButton
          text="Proceed"
          className="flex-1"
          click={goTo}
          buttonStyle="red"
          disabledLoader
          isDisabled={checkedOption === UserSmallPlanSelected.NOTHING}
        />
      </div>
    </div>
  );
};
