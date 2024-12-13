import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import SigninForm from '@/app/views/components/forms/SigninForm';

const SignInLayout: FC = () => {
  return (
    <SigninForm>
      {(isLoading: boolean) => (
        <div className="extra-group ">
          <PrimaryButton
            text="Proceed"
            isDisabled={isLoading}
            type="submit"
            className="signin-btn"
          />
          <div className="extra-group link-center link-underline">
            <Link to="/auth/recovery" className="link codefend-text-red">
              Have you forgotten your password? Recover it here!
            </Link>
          </div>
          <div className="extra-group link-center link-underline low-space">
            <Link to="/auth/signup" className="link codefend-text-red">
              Don’t have an account yet? Sign up
            </Link>
          </div>
        </div>
      )}
    </SigninForm>
  );
};

export default SignInLayout;
