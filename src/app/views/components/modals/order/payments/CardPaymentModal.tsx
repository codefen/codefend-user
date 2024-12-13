import { useCallback, useEffect, useRef } from 'react';
import { OrderSection } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';

let stripePromise = loadStripe(
  'pk_live_51OJhuSAYz1YvxmilzJk2qtYgC6lrwwjziEOc69rTgUI0guBwWsAlnHOViPvLlf6myPtxFrsr0l1JfmdTjDjV9iRt00zJeEpd45'
);

export const CardPaymentModal = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { updateState, referenceNumber, orderId } = useOrderStore(state => state);
  const merchId = useRef('null');
  const optionsRef = useRef({});
  const fetchClientSecret = useCallback(() => {
    return fetcher<any>('post', {
      body: {
        model: 'orders/add',
        phase: 'financial_card_launch',
        company_id: getCompany(),
        reference_number: referenceNumber,
        order_id: orderId,
      },
    }).then(({ data }: any) => {
      merchId.current = data.merch_cid;
      return data.merch_cs;
    });
  }, [merchId]);

  optionsRef.current = {
    fetchClientSecret,
    onComplete: () => {
      fetcher<any>('post', {
        body: {
          model: 'orders/add',
          phase: 'financial_card_finish',
          company_id: getCompany(),
          reference_number: referenceNumber,
          order_id: orderId,
          merch_cid: merchId.current,
        },
        timeout: 1000000,
      })
        .then(({ data }: any) => {
          if (data.status === 'complete') {
            updateState('orderStepActive', OrderSection.WELCOME);
          }
        })
        .catch(() => {
          updateState('orderStepActive', OrderSection.PAYMENT_ERROR);
        });
    },
  };

  useEffect(() => {
    return () => {
      let iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      });
    };
  }, []);

  const backStep = () => {
    updateState('orderStepActive', OrderSection.PAYMENT);
  };

  return (
    <>
      <div className="step-header">
        <h3>Please complete with your payment information</h3>
      </div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={optionsRef.current}>
        <EmbeddedCheckout className="stripe-container" id="stripe-ex-content-checkout" />
      </EmbeddedCheckoutProvider>
      <PrimaryButton
        text="Back"
        buttonStyle="black"
        disabledLoader
        click={backStep}
        className="stripe-back-btn"
      />
    </>
  );
};
