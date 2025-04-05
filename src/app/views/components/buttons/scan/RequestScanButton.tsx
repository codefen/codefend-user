import { type FC } from 'react';
import '../buttons.scss';
import './scanButtons.scss';
import Show from '@/app/views/components/Show/Show';
import { ButtonLoader } from '@/app/views/components/loaders/Loader';

interface RequestScanButtonProps {
  scanLoading: boolean;
  message: string;
  action: () => void;
}

export const RequestScanButton: FC<RequestScanButtonProps> = props => {
  return (
    <button className="btn scan-btn" onClick={props.action}>
      <Show when={props.scanLoading} fallback={<p>REQUEST SCAN</p>}>
        <div className="message">
          <ButtonLoader />
          <p>{props.message}</p>
        </div>
      </Show>
    </button>
  );
};
