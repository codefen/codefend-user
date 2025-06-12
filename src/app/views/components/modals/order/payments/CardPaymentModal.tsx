import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderSection, UserPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import Show from '@/app/views/components/Show/Show';
import { useTheme } from '@/app/views/context/ThemeContext';

// Llave de prueba = pk_test_51OJhuSAYz1YvxmilHmPHF8hzpPAEICOaObvc6jogRaqY79MSgigrWUPPpXcnWOCMh4hs4ElO3niT7m1loeSgN0oa00vVlSF8Ad
// Llave de producción = pk_live_51OJhuSAYz1YvxmilzJk2qtYgC6lrwwjziEOc69rTgUI0guBwWsAlnHOViPvLlf6myPtxFrsr0l1JfmdTjDjV9iRt00zJeEpd45
const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51OJhuSAYz1YvxmilHmPHF8hzpPAEICOaObvc6jogRaqY79MSgigrWUPPpXcnWOCMh4hs4ElO3niT7m1loeSgN0oa00vVlSF8Ad';

export const CardPaymentModal = ({
  setCallback,
}: {
  setCallback: (callback: (() => void) | null) => void;
}) => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { updateState, referenceNumber, orderId, paywallSelected } = useOrderStore(state => state);
  const merchId = useRef('null');
  const companyId = useMemo(() => getCompany(), [getCompany()]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const [hideBackButton, setHideBackButton] = useState(false);
  const { theme } = useTheme();

  // Memoize the Stripe promise
  const stripePromise = useMemo(() => loadStripe(STRIPE_PUBLISHABLE_KEY), []);

  const fetchClientSecret = useCallback(async () => {
    if (isInitialized.current) return;

    try {
      const { data } = await fetcher<any>('post', {
        body: {
          phase: 'financial_card_launch',
          company_id: companyId,
          reference_number: referenceNumber,
          order_id: orderId,
        },
        path: `orders/add${paywallSelected === UserPlanSelected.AUTOMATED_PLAN ? '/small' : ''}`,
      });

      merchId.current = data.merch_cid;
      setClientSecret(data.merch_cs);
      isInitialized.current = true;
    } catch (error) {
      console.error('Error fetching client secret:', error);
      updateState('orderStepActive', OrderSection.PAYMENT_ERROR);
    }
  }, [companyId, referenceNumber, orderId, paywallSelected, fetcher, updateState]);

  // Initialize Stripe when component mounts
  useEffect(() => {
    fetchClientSecret();
  }, []); // Empty dependency array since we only want to run this once

  const options = useMemo(
    () => ({
      clientSecret,
      onComplete: () => {
        setHideBackButton(true);
        fetcher<any>('post', {
          body: {
            phase: 'financial_card_finish',
            company_id: companyId,
            reference_number: referenceNumber,
            order_id: orderId,
            merch_cid: merchId.current,
          },
          path: `orders/add${paywallSelected === UserPlanSelected.AUTOMATED_PLAN ? '/small' : ''}`,
          timeout: 1000000,
        })
          .then(({ data }: any) => {
            if (data.status === 'complete') {
              updateState('orderStepActive', OrderSection.WELCOME);
              setCallback(null);
            }
          })
          .catch(() => {
            updateState('orderStepActive', OrderSection.PAYMENT_ERROR);
          })
          .finally(() => {
            setHideBackButton(false);
          });
      },
    }),
    [
      clientSecret,
      companyId,
      referenceNumber,
      orderId,
      merchId.current,
      theme,
      fetcher,
      updateState,
    ]
  );

  const cleanupStripe = useCallback(() => {
    merchId.current = 'null';
    setClientSecret(null);
    isInitialized.current = false;
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    });
  }, []);

  useEffect(() => {
    setCallback(cleanupStripe);
    return cleanupStripe;
  }, [setCallback, cleanupStripe]);

  const backStep = useCallback(() => {
    const backStepValue =
      paywallSelected === UserPlanSelected.AUTOMATED_PLAN
        ? OrderSection.SMALL_PLANS
        : OrderSection.PAYMENT;
    updateState('orderStepActive', backStepValue);
  }, [paywallSelected, updateState]);

  if (!clientSecret) {
    return (
      <div className="step-content">
        <div className="step-header">
          <h3>Loading payment information...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="step-content">
      <div className="step-header">
        <h3>Please complete with your payment information</h3>
      </div>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout
          className="stripe-container"
          id="stripe-ex-content-checkout"
          data-theme={theme === 'dark' ? 'night' : 'stripe'}
        />
      </EmbeddedCheckoutProvider>

      <Show when={!hideBackButton}>
        <div className="button-wrapper next-btns">
          <PrimaryButton
            text="back"
            click={backStep}
            className="stripe-back-btn"
            buttonStyle="black"
            disabledLoader
          />
        </div>
      </Show>
    </div>
  );
};
