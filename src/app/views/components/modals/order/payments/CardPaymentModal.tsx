import { useCallback, useEffect, useMemo, useRef } from 'react';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';

// Llave de prueba = pk_test_51OJhuSAYz1YvxmilHmPHF8hzpPAEICOaObvc6jogRaqY79MSgigrWUPPpXcnWOCMh4hs4ElO3niT7m1loeSgN0oa00vVlSF8Ad
// Llave de producción = pk_live_51OJhuSAYz1YvxmilzJk2qtYgC6lrwwjziEOc69rTgUI0guBwWsAlnHOViPvLlf6myPtxFrsr0l1JfmdTjDjV9iRt00zJeEpd45
let stripePromise = loadStripe(
  'pk_test_51OJhuSAYz1YvxmilHmPHF8hzpPAEICOaObvc6jogRaqY79MSgigrWUPPpXcnWOCMh4hs4ElO3niT7m1loeSgN0oa00vVlSF8Ad'
);

export const CardPaymentModal = () => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { updateState, referenceNumber, orderId, paywallSelected } = useOrderStore(state => state);
  const merchId = useRef('null');
  const companyId = useMemo(() => getCompany(), [getCompany()]);
  const fetchClientSecret = () => {
    return fetcher<any>('post', {
      body: {
        phase: 'financial_card_launch',
        company_id: companyId,
        reference_number: referenceNumber,
        order_id: orderId,
      },
      path: 'orders/add',
      insecure: true,
    }).then(({ data }: any) => {
      merchId.current = data.merch_cid;
      return data.merch_cs;
    });
  };

  const options = useMemo(
    () => ({
      fetchClientSecret,
      onComplete: () => {
        fetcher<any>('post', {
          body: {
            phase: 'financial_card_finish',
            company_id: companyId,
            reference_number: referenceNumber,
            order_id: orderId,
            merch_cid: merchId.current,
          },
          path: 'orders/add',
          timeout: 1000000,
          insecure: true,
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
    }),
    [fetchClientSecret, companyId, referenceNumber, orderId, merchId.current]
  );

  useEffect(() => {
    return () => {
      if (merchId.current === 'null') {
        merchId.current = 'null';
      }
      let iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      });
    };
  }, []);

  const backStep = useCallback(() => {
    const backStepValue =
      paywallSelected === UserPlanSelected.SMALL_P
        ? OrderSection.SMALL_PLANS
        : OrderSection.PAYMENT;
    updateState('orderStepActive', backStepValue);
  }, [paywallSelected]);

  return (
    <>
      <div className="step-header">
        <h3>Please complete with your payment information</h3>
      </div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
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
