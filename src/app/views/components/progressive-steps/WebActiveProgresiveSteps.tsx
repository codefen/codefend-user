import { type FC } from 'react';
import { OrderSection } from '../../../data';
import { StepItem } from './StepItem';

interface ActiveProgressiveStepsProps {
  orderStepActive: OrderSection;
}

export const ActiveProgressiveSteps: FC<ActiveProgressiveStepsProps> = ({ orderStepActive }) => {
  const currentOrCompleted = (current: OrderSection, verify: OrderSection) => {
    if (verify === current) return 'current';
    return verify < current ? 'completed' : '';
  };

  return (
    <div className="steps">
      <StepItem text="1" styles={currentOrCompleted(orderStepActive, OrderSection.SCOPE)} />
      <StepItem text="2" styles={currentOrCompleted(orderStepActive, OrderSection.FREQUENCY)} />
      {/* <StepItem text="3" styles={currentOrCompleted(orderStepActive, OrderSection.TEAM_SIZE)} /> */}
      <StepItem text="3" styles={currentOrCompleted(orderStepActive, OrderSection.ENVIRONMENT)} />
      <StepItem
        text="4"
        styles={currentOrCompleted(orderStepActive, OrderSection.ADDITIONAL_INFO)}
      />
      <StepItem text="5" styles={currentOrCompleted(orderStepActive, OrderSection.PAYMENT)} />
      {/* <StepItem
        text="6"
        styles={currentOrCompleted(orderStepActive, OrderSection.ANY_PAYMENT_METHOD)}
      /> */}
      <StepItem
        text="6"
        styles={currentOrCompleted(
          orderStepActive,
          orderStepActive == OrderSection.WELCOME
            ? OrderSection.WELCOME
            : OrderSection.PAYMENT_ERROR
        )}
      />
    </div>
  );
};
