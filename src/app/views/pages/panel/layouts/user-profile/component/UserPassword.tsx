import { ChangePasswordForm } from '@/app/views/components/forms/ChangePasswordForm';
import { PrimaryButton } from '@buttons/index';

export const UserPassword = () => {
  return (
    <div className="card">
      <div className="over">
        <div className="header">
          <h2 className="table-title">Change password</h2>
        </div>
        <p>Change your user password. Your password must be at least 12 characters long.</p>
        <ChangePasswordForm onDone={() => {}}>
          {isLoading => (
            <PrimaryButton
              className="form-button"
              disabledLoader
              isDisabled={isLoading}
              text="Change Password"
              type="submit"
              buttonStyle="red"
            />
          )}
        </ChangePasswordForm>
      </div>
    </div>
  );
};
