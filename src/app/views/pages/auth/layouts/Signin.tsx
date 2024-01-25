import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthState } from '../../../../data/hooks/useAuthState';
import { PrimaryButton } from '../../../components';
import { Link } from 'react-router-dom';

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

	return (
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
	);
};

export default SignInLayout;
