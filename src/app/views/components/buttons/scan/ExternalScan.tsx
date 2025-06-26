import { type FC } from 'react';
import '../buttons.scss';
import './scanButtons.scss';
import Show from '@/app/views/components/Show/Show';
import { ButtonLoader } from '@/app/views/components/loaders/Loader';

interface RequestScanButtonProps {
  scanLoading: boolean;
  action: () => void;
}

export const ExternalScanButton: FC<RequestScanButtonProps> = props => {
  return (
    <button className="btn scan-btn" onClick={props.action} disabled={props.scanLoading}>
      <Show when={props.scanLoading} fallback={<p>EXTERNAL SCAN</p>}>
        <div className="message">
          <ButtonLoader />
          <p>REQUEST EXTERNAL SCAN</p>
        </div>
      </Show>
    </button>
  );
};
