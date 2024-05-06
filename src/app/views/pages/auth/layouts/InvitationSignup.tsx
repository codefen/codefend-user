import { useEffect, type FC } from 'react';
import { Form, Link, useParams } from 'react-router-dom';
import { PrimaryButton } from '../../../components';
import { useSignupInvitation } from '#commonUserHooks/useSignupInvitation';

export const InvitationSignup: FC = () => {
	const { ref } = useParams();
	const { form, setForm, sendSignUp, isLoading } = useSignupInvitation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		sendSignUp();
	};

	useEffect(() => {
		setForm((current: any) => ({
			...current,
			invokeHash: ref || '',
		}));
	}, [ref]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="input-group">
				<input
					type="text"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							invokeHash: e.target.value,
						}))
					}
					name="invoke_hash"
					value={form.invokeHash}
					placeholder="Invitation Code"
					autoComplete="off"
					required
				/>
			</div>
			<div className="input-group">
				<input
					type="email"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							invokeEmail: e.target.value,
						}))
					}
					name="email_address"
					autoComplete="email"
					placeholder="Email address"
					required
				/>
			</div>
			<div className="input-group">
				<input
					type="text"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							name: e.target.value,
						}))
					}
					name="first_name"
					placeholder="First name"
					autoComplete="given-name"
					required
				/>
			</div>

			<div className="input-group">
				<input
					type="text"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							lastname: e.target.value,
						}))
					}
					name="last_name"
					autoComplete="family-name"
					placeholder="Last name"
					required
				/>
			</div>

			<div className="input-group">
				<input
					type="text"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							username: e.target.value,
						}))
					}
					name="username"
					placeholder="Username"
					autoComplete="off"
					required
				/>
			</div>

			<div className="input-group">
				<input
					type="tel"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							phone: e.target.value,
						}))
					}
					name="phone"
					placeholder="Phone number"
					required
				/>
			</div>

			<div className="input-group">
				<select
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							role: e.target.value,
						}))
					}
					id="social-data"
					defaultValue={''}
					className="log-inputs log-text"
					required>
					<option value="" disabled hidden selected>
						role
					</option>
					<option value="admin">administrative</option>
					<option value="human">human resources</option>
					<option value="info">information tech</option>
					<option value="ads">marketing</option>
					<option value="sales">sales</option>
					<option value="finance">finance</option>
					<option value="cs">customer service</option>
					<option value="prod">production & ops</option>
					<option value="plan">strategy & planning</option>
					<option value="law">legal affairs</option>
				</select>
			</div>
			<div className="input-group">
				<select
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							idiom: e.target.value,
						}))
					}
					id="social-data"
					defaultValue={''}
					className="log-inputs log-text"
					required>
					<option value="" disabled hidden selected>
						Idiom
					</option>
					<option value="ar">Arabic</option>
					<option value="en">English</option>
				</select>
			</div>

			<div className="input-group">
				<input
					type="password"
					onChange={(e) =>
						setForm((current: any) => ({
							...current,
							password: e.target.value,
						}))
					}
					name="password"
					placeholder="Password"
					required
				/>
			</div>

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
					click={() => {}}
					type="submit"
					className="signin-btn"
				/>
			</div>
		</form>
	);
};
