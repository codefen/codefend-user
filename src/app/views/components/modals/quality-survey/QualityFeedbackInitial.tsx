import type { FC, PropsWithChildren } from 'react';
import { ModalWrapper } from '..';
import Show from '@/app/views/components/Show/Show';
import './qualitysurvey.scss';
import { PrimaryButton } from '../..';
import { ModalGradientHeader } from './QualityFeedbackHeader';

interface QualityFeedbackProps extends PropsWithChildren {
  isActive: boolean;
  onClose: () => void;
  onNext: () => void;
  name: string;
}

export const QualityFeedbackInitial: FC<QualityFeedbackProps> = ({
  isActive,
  onClose,
  onNext,
  name,
}) => {
  return (
    <Show when={isActive}>
      <ModalWrapper action={onClose} type="quality-survey-modal">
        <ModalGradientHeader header="The pentest has been finished!" />
        <div className="quality-survey-init">
          <img src="/codefend/fav50.png" alt="" />
          <p>
            We are <b>pleased to confirm the successful completion</b> of your requested penetration
            testing by <b className="codefend-text-red">our verified professional, {name}.</b> To
            maintain and exceed our service standards we kindly ask you to complete the survey below
            to gauge your satisfaction and identify areas for improvement.
          </p>
        </div>
        <div className="quality-btn-container">
          <PrimaryButton
            text="Start review"
            buttonStyle="dark-red"
            className="quality-btn"
            click={onNext}
            disabledLoader
          />
        </div>
      </ModalWrapper>
    </Show>
  );
};
