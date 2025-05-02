import { PrimaryButton } from '../../../../../components/buttons/primary/PrimaryButton';
export const UserPassword = () => {
  return (
    <div className="user-password">
      <h3>Change password</h3>
      <p>Change your user password. Your password must be at least 12 characters long.</p>
      <form onSubmit={() => {}} className="form-profile">
        <input className="form-input" type="password" placeholder="Current password" />
        <input className="form-input" type="password" placeholder="New password" />
        <PrimaryButton className="form-button" text="change password" type="submit" />
      </form>
    </div>
  );
};
