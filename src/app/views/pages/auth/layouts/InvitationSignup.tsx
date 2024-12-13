import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import InvitationSignupForm from '@/app/views/components/forms/InvitationSignupForm';

export const InvitationSignup: FC = () => (
  <InvitationSignupForm>
    {(isLoading: boolean) => (
      <>
        <div className="extra-group">
          <span className="link link-color">
            I have read and accept the{' '}
            <Link to="/help/security-and-privacy-policy" target="_blank">
              <u>security-and-privacy-policy</u>
            </Link>{' '}
            and{' '}
            <Link to="/help/terms-and-condition" target="_blank">
              <u>Terms of Use.</u>
            </Link>
          </span>
        </div>
        <div className="extra-group">
          <PrimaryButton
            text="Proceed"
            isDisabled={isLoading}
            type="submit"
            className="signin-btn"
          />
        </div>
      </>
    )}
  </InvitationSignupForm>
);
