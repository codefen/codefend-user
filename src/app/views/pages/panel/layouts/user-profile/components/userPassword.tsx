import { PrimaryButton } from '@buttons/index';

export const UserPassword = () => {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <div className="table-title">
            <h2>Change password</h2>
          </div>
        </div>
        <p>Change your user password. Your password must be at least 12 characters long.</p>
        <form onSubmit={() => {}} className="form-profile">
          <input className="form-input" type="password" placeholder="Current password" />
          <input className="form-input" type="password" placeholder="New password" />
          <PrimaryButton className="form-button" text="change password" type="submit" />
        </form>
      </div>
    </div>
  );
};
