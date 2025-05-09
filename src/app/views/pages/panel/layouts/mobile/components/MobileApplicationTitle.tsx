import React from 'react';
import { MobileIcon } from '@/app/views/components/icons';
import { PrimaryButton } from '@buttons/index';

interface MobileApplicationTitleProps {
  onAddClick: () => void;
  isLoading: boolean;
}

export const MobileApplicationTitle: React.FC<MobileApplicationTitleProps> = ({
  onAddClick,
  isLoading,
}) => {
  return (
    <div className="card title">
      <div className="header">
        <MobileIcon />
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
