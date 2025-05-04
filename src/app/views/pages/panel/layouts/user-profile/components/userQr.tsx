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
          <img src="/images/qr-demo.png" alt="QR Code for 2FA" />
          <form onSubmit={() => {}}>
            <p>Enter the indicated number:</p>
            <input className="input-primary" type="text" />
            <PrimaryButton className="form-button" text="validate and confirm two-factor" />
          </form>
        </div>
      </div>
    </div>
  );
};
