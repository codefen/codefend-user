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
      <div className="step-header-maximo">
        <img
          src="public/codefend/pentest-header-vector.svg"
          alt="Descripción de la imagen"
          style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px' }}
        />
        <h3>You've reached a maximum!</h3>
      </div>
      <p className="padding">
        Thank you for trying our systems. You or your company have reached a limit, and the action
        you're trying to perform requires subscribing to one of our plans or services.
      </p>
      <div className="step-content">
        <label
          htmlFor="one-resources"
          className={`option-maximo ${checkedOption == UserPlanSelected.NORMAL_ORDER ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.NORMAL_ORDER)}>
          <input
            id="one-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption == UserPlanSelected.NORMAL_ORDER}
            onChange={() => {}}
          />
          <img
            src="public/codefend/pentest-header-vector.svg"
            alt="Normal Order Icon"
            style={{ width: '50px', height: '50px' }}
          />

          {/* <div className="codefend-radio"></div> */}

          <div className="order-snapshot">
            <div className="top">
              <p>Perform a manual pentest on {initialDomain}</p>
            </div>
            <span className="one-pentest">
              Professional hackers will conduct extensive penetration testing for approximately 3
              weeks. Prices starting from $1,500{' '}
            </span>
          </div>
        </label>

        <label
          htmlFor="two-resources"
          className={`option-maximo ${checkedOption == UserPlanSelected.ON_DEMAND ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.ON_DEMAND)}>
          <input
            id="two-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption == UserPlanSelected.ON_DEMAND}
            onChange={() => {}}
          />
          <img
            src="public/codefend/pentest-header-vector.svg"
            alt="Normal Order Icon"
            style={{ width: '50px', height: '50px' }}
          />

          {/* <div className="codefend-radio"></div> */}

          <div className="order-snapshot">
            <div className="top">
              <p>I need to add or analyze another resource</p>
            </div>
            <span className="one-pentest">
              Return to the resource selection screen so you can add or select the resource you want
              to analyze.
            </span>
          </div>
        </label>
        <label
          htmlFor="three-resources"
          className={`option-maximo ${checkedOption === UserPlanSelected.SMALL_P ? 'select-option' : ''}`}
          onClick={() => setCheckedOption(UserPlanSelected.SMALL_P)}>
          <input
            id="three-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption === UserPlanSelected.SMALL_P}
            onChange={() => {}}
          />
          <img
            src="public/codefend/pentest-header-vector.svg"
            alt="Normal Order Icon"
            style={{ width: '50px', height: '50px' }}
          />
          {/* <div className="codefend-radio"></div> */}

          <div className="order-snapshot">
            <div className="top">
              <p>View more affordable plans and monthly subscriptions</p>
            </div>
            <span className="one-pentest">
              Codefend offers automatic service memberships starting at $29 monthly and hacker
              contracts from $299 monthly.
            </span>
          </div>
        </label>
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
