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
import { useTheme } from '@/app/views/context/ThemeContext';
import { nodeEnv, stripeKey, stripeKeyTest } from '@utils/config';
import { usePaymentTelemetry } from '@hooks/common/usePaymentTelemetry';

const NODE_ENV = nodeEnv;
const STRIPE_PUBLISHABLE_KEY = NODE_ENV == 'development' ? stripeKeyTest : stripeKey;

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
  const { trackPaymentStart, trackPaymentComplete, trackPaymentError } = usePaymentTelemetry();
  console.log(
    'STRIPE_PUBLISHABLE_KEY',
    localStorage.getItem('stripeEnv') == 'true' ? stripeKeyTest : stripeKey
  );
  // Memoize the Stripe promise
  const stripePromise = useMemo(
    () => loadStripe(localStorage.getItem('stripeEnv') == 'true' ? stripeKeyTest : stripeKey),
    []
  );

  const fetchClientSecret = useCallback(async () => {
    if (isInitialized.current) return;

    // Track payment start
    trackPaymentStart('stripe', orderId);

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
      trackPaymentError('stripe', 'client_secret_error', orderId);
      updateState('orderStepActive', OrderSection.PAYMENT_ERROR);
    }
  }, [companyId, referenceNumber, orderId, paywallSelected, fetcher, updateState, trackPaymentStart, trackPaymentError]);

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
              trackPaymentComplete('stripe', orderId);
              updateState('orderStepActive', OrderSection.WELCOME);
              setCallback(null);
            }
          })
          .catch(() => {
            trackPaymentError('stripe', 'payment_finish_error', orderId);
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
    </div>
  );
};
