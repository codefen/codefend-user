import React, { ChangeEvent, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { toast } from 'react-toastify';

import { PrimaryButton } from '../../../components';
import { useAuthState, RegisterFinishParams } from '../../../../data';

const FinishSignUpLayout = () => {
	const { signUpFinish } = useAuthState();

	const [userState, setUserState] = useState({
		email: '',
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
			!userState.email ||
			userState.email.length < 0 ||
			userState.email.length > 50
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
			username: userState.email,
			password: userState.password,
			lead_reference_number: ref,
		};

		setUserState((prevState) => ({ ...prevState, isLoading: true }));

		signUpFinish(requestParams)
			.then(() => {
				return navigate('/auth/signin');
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
		<>
			<section className="access log-component">
				<div className="container">
					<div className="forms">
						<div className="nav">
							<span className="active">
								<a href="#">finish registration</a>
							</span>
						</div>
						<form onSubmit={handleSubmit}>
							<div style={{ maxWidth: '30%' }} className="input-group">
								<input
									type="email"
									name="email"
									value={userState.email}
									onChange={handleChange}
									placeholder="Select Username"
									required
								/>
							</div>

							<div style={{ maxWidth: '30%' }} className="input-group">
								<input
									type="password"
									name="password"
									value={userState.password}
									onChange={handleChange}
									placeholder="Select Password"
									required
								/>
							</div>

							<div style={{ maxWidth: '30%' }} className="input-group">
								<input
									type="password"
									name="confirmPassword"
									value={userState.confirmPassword}
									onChange={handleChange}
									placeholder="Select Confirm Password"
									required
								/>
							</div>

							<div className="mt-6">
								<span className="text-sm text-alt3">
									I have read and accept the <u>Privacy Policy</u> and{' '}
									<u>Terms of Use.</u>
								</span>
							</div>
							<div className="mt-6">
								<PrimaryButton
									text="Proceed"
									type="submit"
									isDisabled={userState.isLoading}
									click={handleSubmit}
									className="flex items-center gap-x-2"
								/>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	);
};

export default FinishSignUpLayout;
