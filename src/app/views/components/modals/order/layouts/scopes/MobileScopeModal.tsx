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
  const { sendScopeOrders } = useOrderScope();
  const { oneExecute } = useTimeout(() => setTryClick(false), 2600);
  const navigate = useNavigate();
  const selectedAppStored = useGlobalFastField('selectedApp');
  const globalStore = useGlobalFastFields(['selectedApp', 'planPreference', 'isDefaultPlan']);

  useEffect(() => {
    const downloads = globalStore.selectedApp.get?.app_android_downloads;
    const cleaned = downloads?.replace?.(/&[A-Za-z]+;/g, '').replace(/[^\dKMkm.]/g, '');
    const match = cleaned?.match?.(/^([\d.]+)([KMkm])?$/);

    const number = parseFloat(match?.[1]);
    const unit = match?.[2]?.toUpperCase?.();

    if (unit === 'K') {
      if (number >= 15000) {
        globalStore.planPreference.set('advanced');
      } else if (number >= 5000) {
        globalStore.planPreference.set('medium');
      } else {
        globalStore.planPreference.set('small');
      }
    } else if (unit === 'M') {
      globalStore.planPreference.set('advanced');
    } else {
      globalStore.planPreference.set('medium');
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
      sendScopeOrders(resourceType, selectedAppStored.get?.id).then((res: any) => {
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
        <div
          className="app-card-container"
          style={{
            width: '83%',
            margin: '0 auto',
          }}>
          <AppCard
            id={selectedAppStored.get?.id}
            type="mobile"
            name={selectedAppStored.get?.app_name || selectedAppStored.get?.name || ''}
            appDesc={selectedAppStored.get?.app_desc || selectedAppStored.get?.description || ''}
            appMedia={selectedAppStored.get?.app_media || ''}
            appReviews={selectedAppStored.get?.app_reviews}
            appRank={selectedAppStored.get?.app_rank}
            appDeveloper={selectedAppStored.get?.app_developer}
            issueCount={selectedAppStored.get?.final_issues || 0}
          />
        </div>
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
