import { type FC } from 'react';
import './step.scss';

interface StepItemProps {
  text: string;
  styles: string;
}

export const StepItem: FC<StepItemProps> = ({ text, styles = '' }) => (
  <span className={`step ${styles}`} data-text={text}>
    <div className="step-dot"></div>
  </span>
);
