import { UserMfaForm } from '@/app/views/components/forms/UserMfaForm';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { PrimaryButton } from '@buttons/index';
import { CheckCircleIcon } from '@icons';
import { useMemo } from 'react';

const UserMfaText = ({ isDisabledMFA }: { isDisabledMFA: boolean }) => {
  if (isDisabledMFA) {
    return (
      <p>
        Enable two-factor authentication to add an extra layer of protection to your account. First,
        use your phone to scan the QR code using{' '}
        <a className="highlight" href="#">
          Authenticator
        </a>
        .
      </p>
    );
  }
  return <p>Two-factor authentication is enabled for your account.</p>;
};

export const UserQr = () => {
  const user = useGlobalFastField('user');
  const isDisabledMFA = useMemo(() => {
    return user?.get?.mfa_llave == 'disabled';
  }, [user.get]);

  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <div className="table-title">
            <h2>Two-factor authentication</h2>
          </div>
        </div>
        <UserMfaText isDisabledMFA={isDisabledMFA} />
        <div className="qr-contain">
          {isDisabledMFA ? (
            <UserMfaForm>
              {isLoading => (
                <PrimaryButton
                  className="form-button"
                  disabledLoader
                  isDisabled={isLoading}
                  text="validate and confirm two-factor"
                  type="submit"
                />
              )}
            </UserMfaForm>
          ) : (
            <>
              <div className="mfa-active">
                <div className="mfa-active-icon">
                  <CheckCircleIcon />
                </div>
                <div>
                  <h3>Two-factor authentication active</h3>
                  <p>
                    Your account is protected with an extra layer of security. Every time you log
                    in, you'll need to enter a verification code from your authenticator app.
                  </p>
                </div>
              </div>
              <PrimaryButton
                text="Disable two-factor authentication"
                buttonStyle="red"
                className="full disabled-btn"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
