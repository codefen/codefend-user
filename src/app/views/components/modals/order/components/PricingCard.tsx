import { UserSmallPlanSelected } from '@interfaces/order';
import type { ReactNode } from 'react';

interface PricingFeature {
  text: string;
  isBold?: string;
}

interface PricingCardProps {
  title: string;
  price: number;
  features: string[];
  imageSrc?: string;
  selectedPlan: any;
  planType: any;
  onSelect: (planType: any) => void;
  icon?: ReactNode;
  textWithPrice?: string;
}

export const PricingCard = ({
  title,
  price,
  features,
  imageSrc,
  selectedPlan,
  planType,
  onSelect,
  icon,
  textWithPrice = 'per month',
}: PricingCardProps) => {
  const isSelected = selectedPlan === planType;

  return (
    <label
      className={`pricing-card ${isSelected ? 'selected' : ''}`}
      htmlFor={`plan-input-${planType}`}
      data-plan={planType}>
      <input
        type="radio"
        name="plan"
        id={`plan-input-${planType}`}
        checked={selectedPlan == planType}
        onChange={() => onSelect(planType)}
        style={{ display: 'none' }}
      />
      <div className="pricing-list-items">
        {icon ? icon : <img src={imageSrc} alt={title} className="pricing-image small-image" />}
        <h4>{title}</h4>

        <ul>
          {features.map((feature, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: feature }} />
          ))}
          <li className="price">
            <span>
              <strong>
                ${price} {textWithPrice}
              </strong>
            </span>
          </li>
        </ul>
      </div>
    </label>
  );
};
