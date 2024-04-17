import { type FC, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	useNetworkSettingState,
	type NetworkSettingState,
} from '../../../../data';
import { NetworkIcon, PrimaryButton } from '../../../components';
import { useLoginAction } from '../../../../data/hooks/users/common/useLoginAction.ts';

const SignInLayout: FC = () => {
	const { signInUser } = useLoginAction();
	const navigate = useNavigate();

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
				if (user) {
					if (user?.accessRole == 'user') navigate('/');
					if (user?.accessRole == 'admin') navigate('/admin');
					if (user?.accessRole == 'hacker') navigate('/provider/profile');
				}
			})
			.finally(() =>
				setSigninForm((current) => ({
					...current,
					isLoading: false,
				})),
			);
	};

	const { setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);

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
