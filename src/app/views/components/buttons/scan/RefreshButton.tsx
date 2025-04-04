import { type FC } from 'react';
import '../buttons.scss';
import './scanButtons.scss';
import { ButtonLoader } from '@/app/views/components/loaders/Loader';

interface RefreshButtonProps {
  action: () => void;
}

export const RefreshButton: FC<RefreshButtonProps> = props => {
  return (
    <button className="btn scan-btn" onClick={props.action}>
      <div className="scan-container">
        <ButtonLoader />
        <p>REFRESH</p>
      </div>
    </button>
  );
};
