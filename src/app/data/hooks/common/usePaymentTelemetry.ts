import { useTelemetry } from './useTelemetry';

export const usePaymentTelemetry = () => {
  const { trackEvent } = useTelemetry();

  // Evento de telemetría: inicio de proceso de compra/pago
  const trackPaymentStart = (method: 'stripe' | 'crypto' | 'bank', orderId?: string, amount?: number) => {
    trackEvent({
      event: "compra_inicio",
      category: "pago",
      action: "iniciar_proceso",
      label: method,
      order_id: orderId,
      monto: amount,
      currency: "USD",
      value: amount || 0,
    });
  };

  // Evento de telemetría: compra/pago realizado correctamente
  const trackPaymentComplete = (method: 'stripe' | 'crypto' | 'bank', orderId?: string, amount?: number) => {
    trackEvent({
      event: "compra_realizada",
      category: "pago",
      action: "finalizar_proceso",
      label: method,
      order_id: orderId,
      monto: amount,
      currency: "USD",
      value: amount || 0,
    });
  };

  // Evento de telemetría: error durante el proceso de compra/pago
  const trackPaymentError = (method: 'stripe' | 'crypto' | 'bank', error?: string, orderId?: string) => {
    trackEvent({
      event: "compra_error",
      category: "pago",
      action: "error_proceso",
      label: method,
      error_tipo: error,
      order_id: orderId,
    });
  };

  // Evento de telemetría: usuario selecciona método de pago
  const trackPaymentMethodSelection = (method: 'stripe' | 'crypto' | 'bank', value?: number) => {
    trackEvent({
      event: "compra_medio",
      category: "pago",
      action: "seleccionar_metodo",
      label: method,
      currency: "USD",
      value: value || 0,
    });
  };

  return {
    trackPaymentStart,
    trackPaymentComplete,
    trackPaymentError,
    trackPaymentMethodSelection,
  };
}; 