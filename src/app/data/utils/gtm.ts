export const sendEventToGTM = (eventData: {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  demora?: number;
  demora_total?: number;
  [key: string]: any;
}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      ...eventData,
      timestamp: Date.now(),
    });
  }
};
