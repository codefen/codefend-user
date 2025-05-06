import useTimeout from '#commonHooks/useTimeout';
import { OrderErrorMessage } from '@/app/views/components/OrderErrorMessage/OrderErrorMessage';
import { PrimaryButton } from '@buttons/index';
import { useOrderScope } from '@hooks/index';
import { MobileIcon } from '@icons';
import { OrderSection } from '@interfaces/order';
import { useGetResources } from '@resourcesHooks/global/useGetResources';
import { useOrderStore } from '@stores/orders.store';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useGlobalFastField, useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { AppCard } from '@/app/views/components/AppCard/AppCard';
import './MobileScopeModal.scss';

export const MobileScopeModal = () => {
  const { resourceType, updateState, acceptCondition } = useOrderStore(state => state);
  const [acceptConditions, setAcceptCondition] = useState<boolean>(acceptCondition);
  const [tryClick, setTryClick] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const { getAnyResource } = useGetResources();
  const navigate = useNavigate();
  const selectedAppStored = useGlobalFastField('selectedApp');
  const globalStore = useGlobalFastFields(['selectedApp', 'planPreference', 'isDefaultPlan']);

  useEffect(() => {
    const app = globalStore.selectedApp.get;
    if (app.app_rank <= 2 && app.app_rank <= 6) {
      globalStore.planPreference.set('small');
    } else if (app.app_rank <= 5 && app.app_rank <= 15) {
      globalStore.planPreference.set('medium');
    } else {
      globalStore.planPreference.set('advanced');
    }
  }, [selectedAppStored.get]);

  const goToNavigate = () => {
    updateState('open', false);
    updateState('orderStepActive', OrderSection.PAYWALL);
    navigate('/mobile');
  };

  const nextStep = () => {
    if (acceptConditions) {
      updateState('acceptCondition', acceptConditions);
      sendScopeOrders(resourceType).then((res: any) => {
        updateState('referenceNumber', res?.order.reference_number);
      });
      updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN);
    } else if (!acceptConditions) {
      setTryClick(true);
      oneExecute();
    }
  };

  return (
    <div className="step-content scope">
      <div className="step-header">
        <h3 style={{ marginBottom: '0px', paddingBottom: '0px' }}>
          <MobileIcon />
          Mobile resources
        </h3>
        <p>
          We are about to start a new pentest for all domains defined in your web resources. We have
          detected the following resources:
        </p>
      </div>
      <div className="step-content">
        {isLoading ? (
          <p>Loading application details...</p>
        ) : selectedApp ? (
          <div
            className="app-card-container"
            style={{
              width: '83%',
              margin: '0 auto',
            }}>
            <AppCard
              id={selectedApp.id}
              type="mobile"
              name={selectedApp.app_name || selectedApp.name || ''}
              appDesc={selectedApp.app_desc || selectedApp.description || ''}
              appMedia={selectedApp.app_media || ''}
              appReviews={selectedApp.app_reviews}
              appRank={selectedApp.app_rank}
              appDeveloper={selectedApp.app_developer}
              issueCount={selectedApp.final_issues || 0}
            />
          </div>
        ) : (
          <p>No application selected or found.</p>
        )}
      </div>

      <div className="scope-confirm">
        <input
          id="confirmation"
          type="checkbox"
          alt="checkbox"
          className="codefend-checkbox confirm-check"
          defaultChecked={acceptConditions}
          onChange={() => setAcceptCondition(!acceptConditions)}
        />
        <label htmlFor="confirmation" className="confirm-label">
          <span className="codefend-text-red underline-high disclaimers" title="Open disclaimers">
            I confirm I have authorization
          </span>
          <span>and I’ve read and accept the disclaimer.</span>
        </label>
        <OrderErrorMessage tryClick={tryClick} acceptConditions={acceptConditions} />
      </div>

      <div className="button-wrapper next-btns">
        <div className="secondary-container">
          <PrimaryButton
            text="Edit resources"
            click={goToNavigate}
            className="full"
            buttonStyle="black"
            disabledLoader
          />
        </div>
        <div className="primary-container">
          <PrimaryButton
            text="Continue"
            click={nextStep}
            className="full"
            buttonStyle="red"
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
