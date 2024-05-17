import { type FC, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../../components';
import { useLoginAction } from '../../../../data/hooks/users/common/useLoginAction.ts';

const SignInLayout: FC = () => {
	const { signInUser } = useLoginAction();
	const navigate = useNavigate();
	const location = useLocation();

	const [signinForm, setSigninForm] = useState({
		email: '',
		password: '',
		isLoading: false,
	});

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setSigninForm((current) => ({ ...current, isLoading: true }));

		signInUser({
			email: signinForm.email,
			password: signinForm.password,
		})
			.then((user) => {
				const state = location.state;
				if (user && state && state?.redirect) {
					navigate(state.redirect);
				} else if (user) {
					if (user?.accessRole == 'user') navigate('/');
					if (user?.accessRole == 'admin') navigate('/admin');
					if (user?.accessRole == 'provider')
						navigate('/provider/profile');
				}
			})
			.finally(() =>
				setSigninForm((current) => ({
					...current,
					isLoading: false,
				})),
			);
	};

	return (
		<>
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
						<Link to="/auth/recovery" className="link codefend-text-red">
							Have you forgotten your password? Recover it here!
						</Link>
					</div>
					<div className="extra-group link-center link-underline low-space">
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
