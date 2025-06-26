import { type FC } from 'react';
import { PrimaryButton } from '@buttons/index';

interface MobileApplicationTitleProps {
  onAddClick: () => void;
  isLoading: boolean;
}

export const MobileApplicationTitle: FC<MobileApplicationTitleProps> = ({
  onAddClick,
  isLoading,
}) => {
  return (
    <div className="card title">
      <div className="header">
        {/* <MobileIcon /> */}
        <span>Mobile resources</span>
      </div>
      <div className="content">
        <p>
          Manage the mobile applications used by your company that you want to monitor or perform
          penetration testing on.
        </p>
        <div className="actions">
          <PrimaryButton
            text="Add application"
            click={onAddClick}
            className={'btn-black'}
            isDisabled={isLoading}
            disabledLoader={true}
          />
        </div>
      </div>
    </div>
  );
};
