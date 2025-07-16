import { type FC } from 'react';
import { OrderSection } from '@interfaces/order';

interface OrderProgressBarProps {
  orderStepActive: OrderSection;
}

export const OrderProgressBar: FC<OrderProgressBarProps> = ({ orderStepActive }) => {
  // Mapeo de pasos a porcentajes de progreso
  const getProgressPercentage = (step: OrderSection): number => {
    const stepMap: Record<OrderSection, number> = {
      [OrderSection.SCOPE]: 16.67,
      [OrderSection.WEB_SCOPE]: 16.67,
      [OrderSection.MOBILE_SCOPE]: 16.67,
      [OrderSection.NETWORK_SCOPE]: 16.67,
      [OrderSection.SOCIAL_SCOPE]: 16.67,
      [OrderSection.SMALL_PLANS]: 16.67,
      [OrderSection.RECOMMENDED_PLAN]: 33.33,
      [OrderSection.ALL_PLANS]: 33.33,
      [OrderSection.ENVIRONMENT]: 50,
      [OrderSection.FREQUENCY]: 50,
      [OrderSection.TEAM_SIZE]: 50,
      [OrderSection.ADDITIONAL_INFO]: 66.67,
      [OrderSection.PAYMENT]: 83.33,
      [OrderSection.ANY_PAYMENT_METHOD]: 100,
      [OrderSection.WELCOME]: 100,
      [OrderSection.PAYMENT_ERROR]: 100,
      [OrderSection.PAYWALL]: 0,
      [OrderSection.PAYWALL_MAX_SCAN]: 0,
      [OrderSection.ARABIC_PLAN]: 0,
      [OrderSection.WAIT_CHECK]: 100,
    };
    
    return stepMap[step] || 0;
  };

  const currentProgress = getProgressPercentage(orderStepActive);

  return (
    <div className="order-progress-container">
      <div className="order-progress-bar">
        <div className="order-progress-track">
          <div 
            className={`order-progress-fill ${currentProgress === 100 ? 'complete' : ''}`}
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <div className="order-progress-dots">
          {[16.67, 33.33, 50, 66.67, 83.33, 100].map((percentage, index) => (
            <div
              key={index}
              className={`order-progress-dot ${currentProgress >= percentage ? 'active' : ''} ${currentProgress === 100 && currentProgress >= percentage ? 'complete' : ''}`}
              style={{ left: `${percentage}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 