import { type FC, useState } from 'react';
import { PrimaryButton } from '../../../components';
import { useNavigate } from 'react-router';

const ConfirmationSignUp: FC = () => {
	const navigate = useNavigate();
	const [finishsignup, setFinishSignup] = useState({
		referenceNumber: '',
		isLoading: false,
	});

	const handleCompleteSignup = async (e: any) => {
		e.preventDefault();
		navigate(`/auth/signup/${finishsignup.referenceNumber}`);
	};

	return (
		<form onSubmit={handleCompleteSignup} className="signup-confirm">
			<div className="check-mail">
				<div className="check-mail_img">
					<img
						src="/codefend/check_email.png"
						alt="mail-image"
						decoding="async"
						loading="lazy"
					/>
				</div>
				<div className="check-mail_text">
					<span>we have sent you an email with a code!</span>
					<p>
						please check your inbox, copy the verification code and paste
						it in the field below to confirm your email
					</p>
				</div>
			</div>
			<div className="confirm-input">
				<label htmlFor="otp">Reference Number</label>
				<input
					id="otp"
					type="text"
					onChange={(e) => {
						setFinishSignup((current) => ({
							...current,
							referenceNumber: e.target.value,
						}));
					}}
					name="otp"
					placeholder="Enter Reference Number here"
					required
				/>
			</div>
			<div className="confirm-button">
				<PrimaryButton
					text="Assistance"
					click={() => {}}
					isDisabled={finishsignup.isLoading}
					buttonStyle="black"
					disabledLoader
				/>
				<PrimaryButton
					text="Proceed"
					type="submit"
					isDisabled={finishsignup.isLoading}
					click={() => {}}
					buttonStyle="red"
				/>
			</div>
		</form>
	);
};

export default ConfirmationSignUp;
