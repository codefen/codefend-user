import { useState } from 'react';
import { PrimaryButton } from '../../../components';
import { usePasswordRecovery } from '#commonUserHooks/usePasswordRecovery';
import { useNavigate } from 'react-router';

export const PasswordRecovery = () => {
	const navigate = useNavigate();
	const { sendEmailForRecovery, passwordRecover } = usePasswordRecovery();
	const [activePhase, setPhase] = useState<'email' | 'code'>('email');
	const [passwordRecovery, setPasswordRecovery] = useState({
		email: '',
		referenceNumber: '',
		newPassword: '',
	});

	const handleSendCode = async (e: any) => {
		e.preventDefault();
		sendEmailForRecovery(passwordRecovery.email);
		setPhase('code');
	};

	const handlePasswordRecovery = (e: any) => {
		e.preventDefault();
		passwordRecover(
			passwordRecovery.email,
			passwordRecovery.referenceNumber,
			passwordRecovery.newPassword,
		).finally(() => {
			setPhase('email');
			setPasswordRecovery({
				email: '',
				referenceNumber: '',
				newPassword: '',
			});
			navigate('/auth/signin');
		});
	};

	if (activePhase === 'email') {
		return (
			<form onSubmit={handleSendCode} className="signup-confirm">
				<div className="check-mail">
					<div className="check-mail_img">
						<img src="/codefend/check_email.png" alt="mail-image" />
					</div>
					<div className="check-mail_text">
						<span>Enter your email to identify the account</span>
						<p>
							If the email is registered, we will send you a verification
							code so you can change your password
						</p>
					</div>
				</div>
				<div className="confirm-input">
					<label htmlFor="otp">Email</label>
					<input
						id="otp"
						type="text"
						value={passwordRecovery.email}
						onChange={(e) => {
							setPasswordRecovery((current) => ({
								...current,
								email: e.target.value,
							}));
						}}
						name="otp"
						placeholder="Enter email"
						required
					/>
				</div>
				<div className="confirm-button">
					<PrimaryButton
						text="Proceed"
						type="submit"
						click={() => {}}
						buttonStyle="red"
					/>
				</div>
			</form>
		);
	}
	return (
		<form onSubmit={handlePasswordRecovery} className="signup-confirm">
			<div className="confirm-input">
				<label htmlFor="otp">Reference number</label>
				<input
					id="otp"
					type="text"
					value={passwordRecovery.referenceNumber}
					onChange={(e) => {
						setPasswordRecovery((current) => ({
							...current,
							referenceNumber: e.target.value,
						}));
					}}
					name="otp"
					placeholder="Enter reference number"
					required
				/>
			</div>
			<div className="confirm-input">
				<label htmlFor="otp">New password</label>
				<input
					id="otp"
					type="password"
					value={passwordRecovery.newPassword}
					onChange={(e) => {
						setPasswordRecovery((current) => ({
							...current,
							newPassword: e.target.value,
						}));
					}}
					name="otp"
					placeholder="Enter new password"
					required
				/>
			</div>
			<div className="confirm-button">
				<PrimaryButton
					text="Proceed"
					type="submit"
					click={() => {}}
					buttonStyle="red"
				/>
			</div>
		</form>
	);
};
