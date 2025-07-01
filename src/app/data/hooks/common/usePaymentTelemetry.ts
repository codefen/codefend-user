import { useTelemetry } from './useTelemetry';

export const usePaymentTelemetry = () => {
  const { trackEvent } = useTelemetry();

  const trackPaymentStart = (method: 'stripe' | 'crypto' | 'bank', orderId?: string, amount?: number) => {
    trackEvent({
      event: "pago_inicio",
      category: "pago",
      action: "iniciar_proceso",
      label: method,
      order_id: orderId,
      monto: amount,
    });
  };

  const trackPaymentComplete = (method: 'stripe' | 'crypto' | 'bank', orderId?: string, amount?: number) => {
    trackEvent({
      event: "pago_completado",
      category: "pago",
      action: "finalizar_proceso",
      label: method,
      order_id: orderId,
      monto: amount,
    });
  };

  const trackPaymentError = (method: 'stripe' | 'crypto' | 'bank', error?: string, orderId?: string) => {
    trackEvent({
      event: "pago_error",
      category: "pago",
      action: "error_proceso",
      label: method,
      error_tipo: error,
      order_id: orderId,
    });
  };

  const trackPaymentMethodSelection = (method: 'stripe' | 'crypto' | 'bank') => {
    trackEvent({
      event: "pago_metodo_seleccionado",
      category: "pago",
      action: "seleccionar_metodo",
      label: method,
    });
  };

  return {
    trackPaymentStart,
    trackPaymentComplete,
    trackPaymentError,
    trackPaymentMethodSelection,
  };
}; 