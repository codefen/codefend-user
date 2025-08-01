import InvitationSignupForm from '@/app/views/components/forms/InvitationSignupForm';
import { PrimaryButton } from '@buttons/index';
import { ModalWrapper } from '@modals/index';
import { Link } from 'react-router';
import css from './newsignup.module.scss';
import { useTheme } from '@/app/views/context/ThemeContext';

export const NewSignupInvitation = () => {
  const { theme } = useTheme();
  return (
    <ModalWrapper showCloseBtn={false} type={css['newsignup']}>
      <div className={css['newsignupContent']}>
        <img src={`/codefend/brand-small-${theme}.png`} width={220} />
        <p style={{ marginBottom: '25px' }}>
          Welcome to Codefend, you are being invited to join a company. Please provide your details
          to continue.
        </p>
        <InvitationSignupForm>
          {(isLoading: boolean) => (
            <>
              {/* <div className="extra-group">
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
              </div> */}
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
      </div>
    </ModalWrapper>
  );
};
