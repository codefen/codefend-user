import { Link } from 'react-router-dom';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { SignupForm } from '@/app/components/forms/SignupForm';

const SignUpLayout = () => (
  <SignupForm>
    {(isLoading: boolean) => (
      <div className="extra-group">
        <PrimaryButton text="Proceed" isDisabled={isLoading} type="submit" className="signin-btn" />
        <div className="extra-group text-center">
          <Link to="/auth/signup/invitation" className="link codefend-text-red link-underline">
            Are you coming by invitation? Sign up here!
          </Link>
        </div>
        <div className="extra-group text-center low-space">
          <Link to="/auth/signin" className="link codefend-text-red link-underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    )}
  </SignupForm>
);

export default SignUpLayout;
