export const sendEventToGTM = ({
  event,
  category,
  action,
  label,
  value,
}: {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
    });
  }
};
