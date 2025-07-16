import { MODAL_KEY_OPEN } from '@/app/constants/app-texts';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { useInitialDomainStore } from '@stores/initialDomain.store';
import useModalStore from '@stores/modal.store';
import { useOrderStore } from '@stores/orders.store';
import { useCallback, memo, useMemo } from 'react';

const firstOptionText = {
  unique: (initialDomain: string) =>
    `Perform a manual pentest on <b class="codefend-text-red">${initialDomain}</b>`,
  notUnique: () => 'Perform a manual pentest',
};

export const PaywallOrderModal = memo(({ close }: any) => {
  const { updateState } = useOrderStore(state => state);
  const { setIsOpen, setModalId } = useModalStore();
  const { appEvent } = useGlobalFastFields(['appEvent']);
  const isIssueLimit = useMemo(
    () => appEvent.get === APP_EVENT_TYPE.LIMIT_REACHED_ISSUE,
    [appEvent.get]
  );
  const { isUniqueDomain, initialDomain } = useInitialDomainStore();

  const handleOptionClick = useCallback((option: UserPlanSelected) => {
    updateState('paywallSelected', option);
    if (option === UserPlanSelected.MANUAL_PENTEST) {
      updateState('orderStepActive', OrderSection.SCOPE);
    } else if (option === UserPlanSelected.LOAD_MORE_RESOURCES) {
      updateState('orderStepActive', OrderSection.PAYWALL);
      updateState('open', false);
      setIsOpen(true);
      setModalId(MODAL_KEY_OPEN.USER_ADD_NEW_RESOURCES);
    } else {
      updateState('orderStepActive', OrderSection.SMALL_PLANS);
    }
  }, [updateState, setIsOpen, setModalId]);

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
    <div className="paywall-container" style={{ position: 'relative' }}>
      <button 
        className="close-button"
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: '15px',
          top: '15px',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          zIndex: 10,
        }}
      >
        ×
      </button>
      
      <div className="step-header-maximo">
        <img
          src="/codefend/globo.png"
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
        <span className="red-remarked-lorem">Thank you for trying our systems.</span> You or your company have reached a limit, and the action
        you're trying to perform requires subscribing to one of our plans or services.
      </p>
      <div className="step-content">
        <div
          className="option-card"
          onClick={() => handleOptionClick(UserPlanSelected.MANUAL_PENTEST)}
        >
          <img
            src="codefend/Plan premium.svg"
            alt="Manual Pentest Icon"
            style={{ width: '90px', height: '90px' }}
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
              weeks. Prices starting from $1,500
            </span>
          </div>
        </div>

        {!isIssueLimit && (
          <div
            className="option-card"
            onClick={() => handleOptionClick(UserPlanSelected.AUTOMATED_PLAN)}
          >
            <img
              src="/codefend/IA ICON.png"
              alt="AI Icon"
              style={{ width: '80px', height: 'auto' }}
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
          </div>
        )}
        
        <p
          className="ending"
          onClick={goToLoadMoreResources}
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            paddingLeft: '2rem',
            marginTop: '1rem',
          }}>
          I need to add or analyze another resource
        </p>
      </div>
    </div>
  );
});
