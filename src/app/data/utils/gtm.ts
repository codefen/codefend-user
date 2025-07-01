export const sendEventToGTM = ({
  event,
  category,
  action,
  label,
  value,
  demora,
  demora_total,
}: {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  demora?: number;
  demora_total?: number;
}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      category,
      action,
      label,
      value,
      demora,
      demora_total,
      timestamp: Date.now(),
    });
  }
};
