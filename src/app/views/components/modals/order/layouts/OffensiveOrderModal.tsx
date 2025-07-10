import { type FC, useState } from 'react';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { OrderSection, OrderOffensive } from '@interfaces/order';
import { useOrderOffensive } from '@hooks/orders/useOrders';
import { useOrderStore } from '@stores/orders.store';
import { GlobeWebIcon } from '@icons';

export const OffensiveOrderModal: FC = () => {
  const { offensiveOrder, updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const [offensiveOrderW, setOffensiveOrder] = useState<OrderOffensive>(offensiveOrder);
  const { sendOrderProvider } = useOrderOffensive();

  const nextStep = () => {
    if (offensiveOrderW !== OrderOffensive.UNKNOWN) {
      updateState('offensiveOrder', offensiveOrderW);
      sendOrderProvider(referenceNumber, offensiveOrderW, orderId).then((data: any) => {
        if (data.error == 0) {
          updateState('orderStepActive', OrderSection.ADDITIONAL_INFO);
        }
      });
    }
  };

  return (
    <div className="step-content plan" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="step-header">
        <h3><GlobeWebIcon />Please tell us about the environment.</h3>
      </div>
      
      <div className="plans-vertical-container">
        <div
          className={`flex-box-row clickable-plan ${
            offensiveOrderW === OrderOffensive.CAREFUL ? `selected` : ``
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.CAREFUL)}
          style={{ cursor: 'pointer' }}>
          <div className="flex-box-column">
            <img
              src="/codefend/pentest-careful.png"
              alt="careful-pentest-icon"
              className="environment-icon"
            />
            <span className="pentest-type-label">Careful pentest</span>
          </div>
          <div className="plan-list">
            <p><b style={{fontWeight: 500, fontFamily: 'satoshi'}}>Recommended for production environments:</b></p>
            <p style={{fontSize: '15px', fontFamily: 'questrial'}}>Codefend's professionals will be extra careful and will avoid all possible risk</p>
          </div>
        </div>
        
        <div
          className={`flex-box-row clickable-plan ${
            offensiveOrderW === OrderOffensive.OFFENSIVE ? `selected` : ``
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.OFFENSIVE)}
          style={{ cursor: 'pointer' }}>
          <div className="flex-box-column">
            <img
              src="/codefend/pentest-offensive.png"
              alt="offensive-pentest-icon"
              className="environment-icon"
            />
            <span className="pentest-type-label">Offensive pentest</span>
          </div>
          <div className="plan-list">
            <p><b style={{fontWeight: 500, fontFamily: 'satoshi'}}>Recommended for test environment:</b></p>
            <p style={{fontSize: '15px', fontFamily: 'questrial'}}>Codefend's professionals may use more disruptive or risky techniques</p>
          </div>
        </div>
        
        <div
          className={`flex-box-row clickable-plan ${
            offensiveOrderW === OrderOffensive.ADVERSARY ? `selected` : ``
          }`}
          onClick={() => setOffensiveOrder(OrderOffensive.ADVERSARY)}
          style={{ cursor: 'pointer' }}>
          <div className="flex-box-column">
            <img
              src="/codefend/pentest-adversary.png"
              alt="adversary-pentest-icon"
              className="environment-icon"
            />
            <span className="pentest-type-label">Adversary simulation</span>
          </div>
          <div className="plan-list">
            <p><b style={{fontWeight: 500, fontFamily: 'satoshi'}}>⚠️ Could cause stress!</b></p>
            <p style={{fontSize: '15px', fontFamily: 'questrial'}}>Codefend's professionals will use all possible techniques to simulate a real attack</p>
          </div>
        </div>
      </div>
      <div className="button-wrapper next-btns">
        <div className="secondary-container ">
          <PrimaryButton
            text="back"
            click={() => updateState('orderStepActive', OrderSection.RECOMMENDED_PLAN)}
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
            isDisabled={offensiveOrderW === OrderOffensive.UNKNOWN}
            disabledLoader
          />
        </div>
      </div>
    </div>
  );
};
