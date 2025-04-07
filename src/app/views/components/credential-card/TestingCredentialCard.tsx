import { useEffect, useState, type FC } from 'react';
import './credentialcard.scss';
import { CopiedIcon, CopyIcon, EyeIcon, LockClosedIcon } from '@icons';
import { useCopyToClipboard } from '#commonHooks/useCopyToClipboard';
import { toast } from 'react-toastify';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';

interface TestingCredentialProps {
  username: string;
  password: string;
  accessLVL: string;
  info: string;
  hideBorderBottom?: boolean;
  viewInfo: () => void;
}

export const TestingCredentialCard: FC<TestingCredentialProps> = props => {
  const [showPassword, setShowPassword] = useState(false);
  const [copyToClipboard, { success }] = useCopyToClipboard();
  const maskedPassword = props?.password ? '•'.repeat(props?.password?.length || 0) : '';

  const togglePasswordVisibility = () => {
    setShowPassword(before => !before);
  };

  const copyElement = () => {
    copyToClipboard(props?.password);
  };

  useEffect(() => {
    if (success) {
      toast.success(APP_MESSAGE_TOAST.COPY_TEXT);
    }
  }, [success]);

  return (
    <div className={`testing-cred ${props.hideBorderBottom && 'hide-border'}`}>
      <div className="avatar">
        <img src="/codefend/user-icon.svg" alt="profile-icon" />
        <span>{props?.accessLVL || ''}</span>
      </div>
      <div className="info">
        <div className="text columns">
          <span>username:</span>
          <span>password:</span>
          <span>Extra info:</span>
        </div>
        <div className="text info-columns">
          <div>{props?.username || ''}</div>
          <div className="password-context">
            <span>{showPassword ? props?.password : maskedPassword}</span>
            <div className="password-buttons">
              <button
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeIcon size={16} /> : <LockClosedIcon size={16} />}
              </button>
              <button
                onClick={copyElement}
                aria-label={!success ? 'Copy password' : 'The password has been copied'}>
                {success ? (
                  <CopiedIcon width={1.5} height={1.5} />
                ) : (
                  <CopyIcon width={1.5} height={1.5} isButton />
                )}
              </button>
            </div>
          </div>
          <span
            className={`codefend-text-red extra-info-cred ${!props.info && 'extra-info-disabled'}`}
            onClick={() => {
              if (props.info) {
                props.viewInfo();
              }
            }}>
            View info...
          </span>
        </div>
      </div>
    </div>
  );
};
