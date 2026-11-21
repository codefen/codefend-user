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

  const options = [
    {
      id: OrderOffensive.CAREFUL,
      title: 'Careful pentest',
      lead: 'Recommended for production environments:',
      body: "Codefend's professionals will be extra careful and will avoid all possible risk",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 3.8c-4.8 1.2-8.2 4.8-9.6 8.4-1.6-1.2-3.4-1.6-5.2-1.2 1.4 2.2 3.6 3.6 6.2 4.2-1.2 2.4-1.6 4.6-1.2 6.4 2.6-1.6 4.6-4.2 5.6-7.2 2.2-.4 4.2-1.6 5.6-3.4-1.2.2-2.4 0-3.4-.6 1.4-1.8 2-3.8 2-6.6z" />
        </svg>
      ),
    },
    {
      id: OrderOffensive.OFFENSIVE,
      title: 'Offensive pentest',
      lead: 'Recommended for test environment:',
      body: "Codefend's professionals may use more disruptive or risky techniques",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3s2.2 3.2 2.2 5.4c0 1.2-.6 2.2-1.4 2.8.8 0 2.2-.4 3.2-1.6.2 2.4-1.2 4.4-3.2 5.2.2 2.6-1.2 5.2-2.8 6.2-2.8-1.6-4.6-4.6-4.6-7.6C5.4 9.2 8.2 5.4 12 3z" />
        </svg>
      ),
    },
    {
      id: OrderOffensive.ADVERSARY,
      title: 'Adversary simulation',
      lead: 'Could cause stress',
      body: "Codefend's professionals will use all possible techniques to simulate a real attack",
      icon: (
        <svg className="stroke" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.5 3.5 19h17L12 3.5z" />
          <path d="M12 9.2v4.6" />
          <path d="M12 16.6h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="step-content plan" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="step-header">
        <h3><GlobeWebIcon />Please tell us about the environment.</h3>
      </div>

      <div className="plans-vertical-container env-options">
        {options.map(option => (
          <button
            key={option.id}
            type="button"
            className={`env-card${offensiveOrderW === option.id ? ' selected' : ''}`}
            onClick={() => setOffensiveOrder(option.id)}>
            <span className="env-icon">{option.icon}</span>
            <span className="env-copy">
              <span className="env-title">{option.title}</span>
              <span className="env-lead">{option.lead}</span>
              <span className="env-body">{option.body}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="button-wrapper next-btns" style={{ position: 'sticky', bottom: 0, backgroundColor: 'var(--bg-color)', padding: '16px 0', borderTop: '1px solid var(--primary-color-300)', zIndex: 10 }}>
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
