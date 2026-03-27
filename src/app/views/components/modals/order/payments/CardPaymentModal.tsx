import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OrderSection, UserPlanSelected, UserSmallPlanSelected } from '@interfaces/order';
import { useOrderStore } from '@stores/orders.store';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useFetcher } from '#commonHooks/useFetcher';
import { useUserData } from '#commonUserHooks/useUserData';
import { useTheme } from '@/app/views/context/ThemeContext';
import { fetchStripePublishableKeysFromApi, nodeEnv } from '@utils/config';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { usePaymentTelemetry } from '@hooks/common/usePaymentTelemetry';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';

/**
 * Alineado con NetworkSettingModal: si `stripeEnv` nunca se guardó, en dev el default es test.
 * Si está guardado como "false", se usa live. Sin el default en dev, loadStripe usa pk_live con
 * cs_test (API) y el Embedded Checkout queda en blanco.
 */
const isStripeTestModeActive = (): boolean => {
  const stripeEnv = localStorage.getItem('stripeEnv');
  if (stripeEnv === 'true') return true;
  if (stripeEnv === 'false') return false;
  return nodeEnv === 'development';
};

export const CardPaymentModal = ({
  setCallback,
}: {
  setCallback: (callback: (() => void) | null) => void;
}) => {
  const [fetcher] = useFetcher();
  const { getCompany } = useUserData();
  const { isAdmin } = useUserRole();
  const { updateState, referenceNumber, orderId, paywallSelected, userSmallPlanSelected } = useOrderStore(state => state);
  const planPreference = useGlobalFastField('planPreference');
  const merchId = useRef('null');
  const companyId = useMemo(() => getCompany(), [getCompany()]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const [hideBackButton, setHideBackButton] = useState(false);
  const { theme } = useTheme();
  const { trackPaymentStart, trackPaymentComplete, trackPaymentError } = usePaymentTelemetry();
  const isTestMode = isStripeTestModeActive();
  const [stripeKeys, setStripeKeys] = useState<{ test: string; live: string } | null>(null);

  useEffect(() => {
    fetchStripePublishableKeysFromApi().then(setStripeKeys);
  }, []);

  const publishableKey =
    stripeKeys === null ? undefined : isTestMode ? stripeKeys.test : stripeKeys.live;

  // Función para obtener el valor del plan seleccionado
  const getPlanValue = (): number => {
    // Para planes pequeños (automated web scan)
    if (userSmallPlanSelected) {
      const smallPlanPrices: Record<string, number> = {
        [UserSmallPlanSelected.BASIC]: 29,
        [UserSmallPlanSelected.MEDIUM]: 59,
        [UserSmallPlanSelected.ADVANCED]: 89,
      };
      return smallPlanPrices[userSmallPlanSelected] || 0;
    }
    
    // Para planes profesionales (pentest on demand)
    if (planPreference.get) {
      const professionalPlanPrices: Record<string, number> = {
        'small': 1500,
        'medium': 4500,
        'advanced': 13500,
      };
      return professionalPlanPrices[planPreference.get] || 0;
    }
    
    return 0;
  };

  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey) : null),
    [publishableKey]
  );

  const fetchClientSecret = useCallback(async () => {
    if (isInitialized.current) return;
    if (!publishableKey) return;

    // Track payment start
    const planValue = getPlanValue();
    trackPaymentStart('stripe', orderId, planValue);

    try {
      const bodyBuild: any = {
        phase: 'financial_card_launch',
        company_id: companyId,
        reference_number: referenceNumber,
        order_id: orderId,
      };
      if (isAdmin()) {
        bodyBuild.havenocoin = isTestMode;
      }
      const { data } = await fetcher<any>('post', {
        body: bodyBuild,
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
  }, [
    companyId,
    referenceNumber,
    orderId,
    paywallSelected,
    fetcher,
    updateState,
    trackPaymentStart,
    trackPaymentError,
    publishableKey,
  ]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  const options = useMemo(
    () => ({
      clientSecret,
      onComplete: () => {
        setHideBackButton(true);
        const bodyBuild: any = {
          phase: 'financial_card_finish',
          company_id: companyId,
          reference_number: referenceNumber,
          order_id: orderId,
          merch_cid: merchId.current,
        };
        if (isAdmin()) {
          bodyBuild.havenocoin = isTestMode;
        }
        fetcher<any>('post', {
          body: bodyBuild,
          path: `orders/add${paywallSelected === UserPlanSelected.AUTOMATED_PLAN ? '/small' : ''}`,
          timeout: 1000000,
        })
                  .then(({ data }: any) => {
          if (data.status === 'complete') {
            const planValue = getPlanValue();
            trackPaymentComplete('stripe', orderId, planValue);
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
    [clientSecret, companyId, referenceNumber, orderId, fetcher, updateState, isTestMode, trackPaymentComplete, trackPaymentError, setCallback]
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

  if (stripeKeys === null) {
    return (
      <div className="step-content">
        <div className="step-header">
          <h3>Loading payment information...</h3>
        </div>
      </div>
    );
  }

  if (!publishableKey) {
    return (
      <div className="step-content">
        <div className="step-header">
          <h3>Stripe: falta la clave publicable</h3>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5 }}>
            Completá <code>stripe_pk_test</code> / <code>stripe_pk_live</code> en{' '}
            <code>reservado/llaves.php</code> (endpoint <code>config/stripe_public</code>) o las variables{' '}
            <code>VITE_STRIPE_KEY_*</code> en <code>.env</code>. La clave publishable debe ser la del mismo
            modo (test/live) que las secret keys del servidor.
          </p>
        </div>
      </div>
    );
  }

  if (!clientSecret || !stripePromise) {
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
        {/* <h3>Please complete with your payment information</h3> */}
      </div>
      <EmbeddedCheckoutProvider
        key={clientSecret}
        stripe={stripePromise}
        options={options}>
        <EmbeddedCheckout
          className="stripe-container"
          id="stripe-ex-content-checkout"
          data-theme={theme === 'dark' ? 'night' : 'stripe'}
        />
      </EmbeddedCheckoutProvider>
    </div>
  );
};
