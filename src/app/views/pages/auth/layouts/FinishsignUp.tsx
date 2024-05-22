import { type FC, type ChangeEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import { toast } from 'react-toastify';
import { PrimaryButton } from '../../../components';
import { type RegisterFinishParams } from '../../../../data';
import { useRegisterAction } from '@userHooks/auth/useRegisterAction';
import { Link } from 'react-router-dom';
import { PasswordRequirements } from './PasswordRequirements';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { useRecomendedUsername } from '#commonUserHooks/useRecomendedUsername';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { TermsOfUse } from './TermsOfUse';

const FinishSignUpLayout: FC = () => {
	const { signUpFinish } = useRegisterAction();
	const { ref } = useParams();
	const { data } = useRecomendedUsername(ref);

	const [userState, setUserState] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		ref: '',
		isLoading: false,
	});
	const navigate = useNavigate();

	useEffect(() => {
		setUserState((prev: any) => ({
			...prev,
			ref: ref || '',
			username: data ? data?.recommended_username || '' : '',
		}));
	}, [ref, data]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserState((prevUserState) => ({
			...prevUserState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!passwordValidation(userState.password)) {
			toast.error(AUTH_TEXT.INVALID_PASSWORD);
			return;
		}
		if (!isEquals(userState.password, userState.confirmPassword)) {
			toast.error(AUTH_TEXT.PASSWORD_NOT_MATCH);
			return;
		}

		const requestParams: RegisterFinishParams = {
			username: userState.username,
			password: userState.password,
			lead_reference_number: userState.ref,
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
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="input-group">
				<input
					type="text"
					name="ref"
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
			<PasswordRequirements password={userState.password} />
			<TermsOfUse />
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
