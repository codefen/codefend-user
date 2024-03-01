import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	NetworkSettingState,
	useAuthState,
	useNetworkSettingState,
} from '../../../../data';
import { NetworkIcon, PrimaryButton } from '../../../components';

const SignInLayout: React.FC = () => {
	const { signInUser } = useAuthState();
	const navigate = useNavigate();

	const [signinForm, setSigninForm] = useState({
		email: '',
		password: '',

		isLoading: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSigninForm((current) => ({ ...current, isLoading: true }));

		setTimeout(() => {
			signInUser({
				email: signinForm.email,
				password: signinForm.password,
			})
				.then((isLoggedIn) => isLoggedIn ?? navigate('/'))
				.finally(() =>
					setSigninForm((current) => ({
						...current,
						isLoading: false,
					})),
				);
		}, 100);
	};

	const { setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);

	return (
		<>
			<div
				className="network-btn"
				onClick={() => setNetworkSettingState(true)}>
				<NetworkIcon width={1.5} height={1.5} />
			</div>
			<form onSubmit={handleSubmit}>
				<div className="input-group ">
					<input
						type="email"
						onChange={(e) =>
							setSigninForm((current) => ({
								...current,
								email: e.target.value,
							}))
						}
						placeholder="Email address"
						autoComplete="email"
						required
					/>
				</div>

				<div className="input-group">
					<input
						type="password"
						onChange={(e) =>
							setSigninForm((current) => ({
								...current,
								password: e.target.value,
							}))
						}
						placeholder="Password"
						required
					/>
				</div>

				<div className="extra-group ">
					<PrimaryButton
						text="Proceed"
						isDisabled={signinForm.isLoading}
						click={() => {}}
						type="submit"
						className="signin-btn"
					/>

					<div className="extra-group link-center link-underline">
						<Link to="/auth/signup" className="link codefend-text-red">
							Don’t have an account yet? Sign up
						</Link>
					</div>
				</div>
			</form>
		</>
	);
};

export default SignInLayout;
