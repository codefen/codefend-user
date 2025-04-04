import { useNavigate } from 'react-router';
import { useState, type FC, type ReactNode } from 'react';
import { useRecomendedUsername } from '#commonUserHooks/useRecomendedUsername';
import InputFieldWithLabel from '../InputFieldWithLabel/InputFieldWithLabel';
import CheckEmail from '@/app/views/components/CheckEmail/CheckEmail';

const ConfirmationForm: FC<{
  children: (isLoading: boolean) => ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const { updateReferenceNumber, refetch } = useRecomendedUsername();
  const [finishSignup, setFinishSignup] = useState({
    referenceNumber: '',
    isLoading: false,
  });

  const handleCompleteSignup = async (e: any) => {
    e.preventDefault();
    updateReferenceNumber(finishSignup.referenceNumber);
    refetch();

    navigate(`/auth/signup/${finishSignup.referenceNumber}`);
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
        value={finishSignup.referenceNumber}
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

      {children(finishSignup.isLoading)}
    </form>
  );
};

export default ConfirmationForm;
