import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import useModalStore from '@stores/modal.store';
import { useOrderStore } from '@stores/orders.store';
import { useCallback, useState, memo, useMemo } from 'react';

const firstOptionText = {
  unique: (initialDomain: string) =>
    `Perform a manual pentest on <b class="codefend-text-red">${initialDomain}</b>`,
  notUnique: () => 'Perform a manual pentest',
};

export const PaywallOrderModal = memo(({ close }: any) => {
  const [checkedOption, setCheckedOption] = useState(UserPlanSelected.NOTHING);
  const { updateState } = useOrderStore(state => state);
  const { setIsOpen, setModalId } = useModalStore();
  const { appEvent } = useGlobalFastFields(['appEvent']);
  const isIssueLimit = useMemo(
    () => appEvent.get === APP_EVENT_TYPE.LIMIT_REACHED_ISSUE,
    [appEvent.get]
  );
  const { isUniqueDomain, initialDomain } = useInitialDomainStore();

  const handleOptionChange = useCallback((option: UserPlanSelected) => {
    setCheckedOption(option);
  }, []);

  const goTo = useCallback(() => {
    if (checkedOption === UserPlanSelected.NOTHING) return;
    updateState('paywallSelected', checkedOption);
    if (checkedOption === UserPlanSelected.MANUAL_PENTEST) {
      updateState('orderStepActive', OrderSection.SCOPE);
    } else if (checkedOption === UserPlanSelected.LOAD_MORE_RESOURCES) {
      updateState('orderStepActive', OrderSection.PAYWALL);
      updateState('open', false);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
    } else {
      updateState('orderStepActive', OrderSection.SMALL_PLANS);
    }
  }, [checkedOption, updateState, setIsOpen, setModalId]);

const goToLoadMoreResources = useCallback(() => {
  updateState('paywallSelected', UserPlanSelected.LOAD_MORE_RESOURCES);
  updateState('orderStepActive', OrderSection.PAYWALL);
  updateState('open', false);
  setIsOpen(true);
  setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
}, [updateState, setIsOpen, setModalId]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  return (
    <div className="paywall-container">
      <div className="step-header-maximo">
        <img
          src="public/codefend/globo.png"
          alt="Descripción de la imagen"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '5px',
            width: '50px',
            height: '50px',
          }}
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
          className={`option-maximo ${checkedOption == UserPlanSelected.MANUAL_PENTEST ? 'select-option' : ''}`}
          onClick={() => handleOptionChange(UserPlanSelected.MANUAL_PENTEST)}>
          <input
            id="one-resources"
            name="scopeOption"
            type="radio"
            className="radio-option"
            checked={checkedOption == UserPlanSelected.MANUAL_PENTEST}
            onChange={() => {}}
          />
          <img
            src="public/codefend/Plan premium.svg"
            alt="Normal Order Icon"
            style={{ width: '50px', height: '50px' }}
          />

          <div className="order-snapshot">
            <div className="top">
              <p
                dangerouslySetInnerHTML={{
                  __html: firstOptionText[isUniqueDomain ? 'unique' : 'notUnique'](initialDomain),
                }}></p>
            </div>
            <span className="one-pentest">
              Professional hackers will conduct extensive penetration testing for approximately 3
              weeks. Prices starting from $1,500{' '}
            </span>
          </div>
        </label>

       



        {!isIssueLimit && (
          <label
            htmlFor="three-resources"
            className={`option-maximo ${checkedOption === UserPlanSelected.AUTOMATED_TICKETS ? 'select-option' : ''}`}
            onClick={() => handleOptionChange(UserPlanSelected.AUTOMATED_TICKETS)}>
            <input
              id="three-resources"
              name="scopeOption"
              type="radio"
              className="radio-option"
              checked={checkedOption === UserPlanSelected.AUTOMATED_TICKETS}
              onChange={() => {}}
            />
            <img
              src="public\codefend\estrellitas.png"
              alt="Normal Order Icon"
              style={{ width: '50px', height: '50px' }}
            />

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
        )}

      </div>
      <p
  className="ending"
  onClick={goToLoadMoreResources}
  style={{ cursor: 'pointer', textDecoration: 'underline', paddingLeft: '2.5rem', marginBottom: '-20px' }}
>
  I need to add or analyze another resource
</p>
      <div className="primary-container paywall">
        <PrimaryButton
          text="Cancel"
          click={handleClose}
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
});
