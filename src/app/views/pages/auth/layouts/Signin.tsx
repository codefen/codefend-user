import { type FC, type FormEvent, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../../components';
import { useLoginAction } from '@userHooks/auth/useLoginAction';
import { AuthInput } from '@defaults/AuthInput';

const SignInLayout: FC = () => {
	const { signInUser, isLoading } = useLoginAction();
	const navigate = useNavigate();
	const location = useLocation();
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		signInUser(
			email.current?.value || '',
			password.current?.value || '',
		).then((user: any) => {
			const state = location.state;
			if (user && state && state?.redirect) {
				navigate(state.redirect);
			} else if (user) {
				if (user?.accessRole == 'user') navigate('/');
				if (user?.accessRole == 'admin') navigate('/admin');
				if (user?.accessRole == 'provider') navigate('/provider/profile');
			}
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<AuthInput
				ref={email}
				type="email"
				placeholder="Email address"
				autoComplete="email"
				required
			/>
			<AuthInput
				ref={password}
				type="password"
				placeholder="Password"
				required
			/>

			<div className="extra-group ">
				<PrimaryButton
					text="Proceed"
					isDisabled={isLoading}
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
	);
};

export default SignInLayout;
