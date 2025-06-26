import { type FC, useEffect, useState } from 'react';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { formatNumber } from '@utils/helper';
import { OrderTeamSize, OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { useOrderPlan } from '@hooks/orders/useOrders';

interface PricePlans {
  small: string;
  full: string;
  medium: string;
}
export const TeamSizeOrderModal: FC = () => {
  const { teamSize, updateState, referenceNumber, orderId } = useOrderStore(state => state);

  const [teamSizeW, setTeamSize] = useState<OrderTeamSize>(teamSize);
  const [currentPrices, setCurrentPrices] = useState<PricePlans | null>(null);
  const { getCurrentPrices, sendPlanTeamSize } = useOrderPlan();

  useEffect(() => {
    getCurrentPrices(referenceNumber, orderId).then(res => {
      setCurrentPrices({
        small: res?.plans_prices?.small || '0',
        medium: res?.plans_prices?.medium || '0',
        full: res?.plans_prices?.full || '0',
      });
    });
  }, []);

  const nextStep = () => {
    const chosenPrice = currentPrices
      ? currentPrices[teamSizeW.valueOf() as keyof typeof currentPrices]
      : '';

    if (teamSizeW !== OrderTeamSize.UNKNOWN) {
      sendPlanTeamSize(teamSizeW, chosenPrice, referenceNumber, orderId);
      updateState('teamSize', teamSizeW);
      if (teamSizeW !== OrderTeamSize.SMALL) {
        updateState('orderStepActive', OrderSection.ENVIRONMENT);
      } else {
        updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);
      }
    }
  };

  const TeamSizeLoader = () => (
    <div>
      <h2 className="order-plan-loader-title">Retrieving current prices from the system</h2>
      <PageLoader />
    </div>
  );

  return (
    <Show when={currentPrices !== null} fallback={<TeamSizeLoader />}>
      <>
        <div className="step-header">
          <h3>Select the desired allocation to protect your company.</h3>
        </div>

        <div className="step-content">
          <div
            className={`option order-pointer ${
              teamSizeW === OrderTeamSize.SMALL && `select-option`
            }`}
            onClick={() => setTeamSize(OrderTeamSize.SMALL)}>
            <h4 className="price-value">${formatNumber(currentPrices?.small || '0')}</h4>

            <div className="order-snapshot">
              <div className="top">
                <h5 className="alt-color">Small allocation:</h5>
              </div>
              <span className="one-pentest">
                This is our basic plan! fits well for small size companies.
              </span>
            </div>
          </div>
          <div
            className={`option order-pointer ${teamSizeW === OrderTeamSize.MID && `select-option`}`}
            onClick={() => setTeamSize(OrderTeamSize.MID)}>
            <h4 className="price-value">${formatNumber(currentPrices?.medium || '0')}</h4>

            <div className="order-snapshot">
              <div className="top">
                <h5>
                  <span className="alt-color">Medium allocation:</span> most selected!
                </h5>
              </div>
              <span className="one-pentest">
                Recommended if your company relies on the scoped resources.
              </span>
            </div>
          </div>
          <div
            className={`option order-pointer ${
              teamSizeW === OrderTeamSize.FULL && `select-option`
            }`}
            onClick={() => setTeamSize(OrderTeamSize.FULL)}>
            <h4 className="price-value">${formatNumber(currentPrices?.full || '0')}</h4>

            <div className="order-snapshot">
              <div className="top">
                <h5 className="alt-color">Full allocation:</h5>
              </div>
              <span className="one-pentest">
                For companies that heavily rely on IT or handle sensitive data.
              </span>
            </div>
          </div>
        </div>

        <div className="button-wrapper next-btns">
          <div className="secondary-container">
            <PrimaryButton
              text="Back"
              click={(e: any) => updateState('orderStepActive', OrderSection.FREQUENCY)}
              className="full"
              buttonStyle="black"
              disabledLoader
            />
          </div>
          <div className="primary-container">
            <PrimaryButton
              text="Next step"
              click={nextStep}
              className="full"
              buttonStyle="red"
              isDisabled={teamSizeW === OrderTeamSize.UNKNOWN}
              disabledLoader
            />
          </div>
        </div>
      </>
    </Show>
  );
};
