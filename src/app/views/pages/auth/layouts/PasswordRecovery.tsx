import { useEffect, useState } from 'react';
import { PrimaryButton } from '../../../components';
import { usePasswordRecovery } from '@userHooks/auth/usePasswordRecovery';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { PasswordRequirements } from '../../../components/auth/PasswordRequirements';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';

export const PasswordRecovery = () => {
	const { ref } = useParams();
	const navigate = useNavigate();
	const { sendEmailForRecovery, passwordRecover } = usePasswordRecovery();
	const [activePhase, setPhase] = useState<'email' | 'code'>('email');
	const [passwordRecovery, setPasswordRecovery] = useState({
		email: '',
		referenceNumber: '',
		newPassword: '',
		repeatedPassword: '',
	});
	useEffect(() => {
		setPasswordRecovery((current: any) => ({
			...current,
			referenceNumber: ref || '',
		}));
		if (ref) {
			setPhase('code');
		}
	}, [ref]);

	const handleSendCode = async (e: any) => {
		e.preventDefault();
		sendEmailForRecovery(passwordRecovery.email);
		setPhase('code');
		toast.success(AUTH_TEXT.SEND_RECOVERY_CODE);
	};

	const handlePasswordRecovery = (e: any) => {
		e.preventDefault();
		if (!passwordValidation(passwordRecovery.newPassword)) {
			toast.error(AUTH_TEXT.INVALID_PASSWORD);
			return;
		}
		if (
			!isEquals(
				passwordRecovery.newPassword,
				passwordRecovery.repeatedPassword,
			)
		) {
			toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
			return;
		}
		passwordRecover(
			passwordRecovery.email,
			passwordRecovery.referenceNumber,
			passwordRecovery.newPassword,
		)
			.then((res) => {
				if (res.error != '0') throw new Error(res.info);

				toast.success(AUTH_TEXT.PASSWORD_UPDATED);
				setPhase('email');
				setPasswordRecovery({
					email: '',
					referenceNumber: '',
					newPassword: '',
					repeatedPassword: '',
				});
				navigate('/auth/signin');
			})
			.catch((err) => {
				toast.error(AUTH_TEXT.FAILURE_PASSWORD_UPDATED);
			});
	};

	if (activePhase === 'email') {
		return (
			<form onSubmit={handleSendCode} className="signup-confirm">
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
						type="email"
						value={passwordRecovery.email}
						onChange={(e) => {
							setPasswordRecovery((current) => ({
								...current,
								email: e.target.value,
							}));
						}}
						name="email"
						autoComplete="email"
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
			<div className="confirm-input">
				<label htmlFor="otp">Repeat new password</label>
				<input
					id="otp"
					type="password"
					value={passwordRecovery.repeatedPassword}
					onChange={(e) => {
						setPasswordRecovery((current) => ({
							...current,
							repeatedPassword: e.target.value,
						}));
					}}
					name="otp"
					placeholder="Enter new password"
					required
				/>
			</div>
			<PasswordRequirements password={passwordRecovery.newPassword} />
			<div className="confirm-button">
				<PrimaryButton
					text="Proceed"
					type="submit"
					buttonStyle="red"
					disabledLoader
				/>
			</div>
		</form>
	);
};
