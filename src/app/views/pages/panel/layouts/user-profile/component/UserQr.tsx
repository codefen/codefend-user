import { UserMfaForm } from '@/app/views/components/forms/UserMfaForm';
import { PrimaryButton } from '@buttons/index';

export const UserQr = () => {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <div className="table-title">
            <h2>Two-factor authentication</h2>
          </div>
        </div>
        <p>
          Enable two-factor authentication to add an extra layer of protection to your account.
          First, use your phone to scan the QR code using{' '}
          <a className="highlight" href="#">
            Authenticator
          </a>
          .
        </p>
        <div className="qr-contain">
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
        </div>
      </div>
    </div>
  );
};
