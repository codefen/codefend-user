import { useNavigate } from 'react-router';
import { useState, type FC, type ReactNode } from 'react';
import { useRecomendedUsername } from '#commonUserHooks/useRecomendedUsername';
import CheckEmail from '../auth/CheckEmail';
import InputFieldWithLabel from '../auth/InputFieldWithLabel';

const ConfirmationForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const { updateReferenceNumber, refetch } = useRecomendedUsername();
  const [finishsignup, setFinishSignup] = useState({
    referenceNumber: '',
    isLoading: false,
  });

  const handleCompleteSignup = async (e: any) => {
    e.preventDefault();
    updateReferenceNumber(finishsignup.referenceNumber);
    refetch();

    navigate(`/auth/signup/${finishsignup.referenceNumber}`);
  };

  return (
    <form onSubmit={handleCompleteSignup}>
      <CheckEmail
        text="we have sent you an email with a code!"
        subText="please check your inbox, copy the verification code and paste
						it in the field below to confirm your email"
      />
      <InputFieldWithLabel
        label="Reference Number"
        value={finishsignup.referenceNumber}
        onChange={e => {
          setFinishSignup(current => ({
            ...current,
            referenceNumber: e.target.value,
          }));
        }}
        name="otp"
        placeholder="Enter Reference Number here"
        required
      />

      {children(finishsignup.isLoading)}
    </form>
  );
};

export default ConfirmationForm;
