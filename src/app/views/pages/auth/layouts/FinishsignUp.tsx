import { type FC, type ChangeEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { toast } from 'react-toastify';

import { PrimaryButton } from '../../../components';
import { type RegisterFinishParams } from '../../../../data';
import { useRegisterAction } from '#commonUserHooks/useRegisterAction';
import { Link } from 'react-router-dom';

const FinishSignUpLayout: FC = () => {
	const { signUpFinish } = useRegisterAction();

	const [userState, setUserState] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		isLoading: false,
	});

	const navigate = useNavigate();
	const { ref } = useParams();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserState((prevUserState) => ({
			...prevUserState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (userState.password !== userState.confirmPassword) {
			return toast.error(
				'Password does not match, Kindly check and try again !!!',
			);
		}
		if (
			!userState.username ||
			userState.username.length < 0 ||
			userState.username.length > 50
		) {
			return toast.error('Invalid username');
		}

		if (
			!userState.password ||
			userState.password.length < 0 ||
			userState.password.length > 50
		) {
			return toast.error('Invalid password');
		}

		const requestParams: RegisterFinishParams = {
			username: userState.username,
			password: userState.password,
			lead_reference_number: ref,
		};

		setUserState((prevState) => ({ ...prevState, isLoading: true }));

		signUpFinish(requestParams)
			.then((res) => {
				if (res == true) navigate('/auth/signin');
			})
			.finally(() => {
				setUserState((prevState) => ({
					...prevState,
					isLoading: false,
				}));
			});

		return null;
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="input-group">
				<input
					type="text"
					name="username"
					value={userState.username}
					onChange={handleChange}
					placeholder="Username"
					required
				/>
			</div>

			<div className="input-group">
				<input
					type="password"
					name="password"
					value={userState.password}
					onChange={handleChange}
					placeholder="Password"
					required
				/>
			</div>

			<div className="input-group">
				<input
					type="password"
					name="confirmPassword"
					value={userState.confirmPassword}
					onChange={handleChange}
					placeholder="Confirm Password"
					required
				/>
			</div>

			<div className="margin-top">
				<span className="text-sm text-alt3">
					I have read and accept the{' '}
					<Link
						className="codefend-text-red"
						to="/help/security-and-privacy-policy"
						target="_blank">
						<u>Privacy Policy</u>
					</Link>{' '}
					and{' '}
					<Link
						className="codefend-text-red"
						to="/help/terms-and-condition"
						target="_blank">
						<u>Terms of Use.</u>
					</Link>
				</span>
			</div>
			<div className="margin-top">
				<PrimaryButton
					text="Proceed"
					type="submit"
					isDisabled={userState.isLoading}
					click={handleSubmit}
					className="center"
				/>
			</div>
		</form>
	);
};

export default FinishSignUpLayout;
