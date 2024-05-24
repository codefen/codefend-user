import { type FC, type ChangeEvent, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

import { toast } from 'react-toastify';
import { PrimaryButton } from '../../../components';
import { type RegisterFinishParams } from '../../../../data';
import { useRegisterPhaseTwo } from '@userHooks/auth/useRegisterPhaseTwo';
import { PasswordRequirements } from './PasswordRequirements';
import { isEquals, passwordValidation } from '@/app/constants/validations';
import { useRecomendedUsername } from '#commonUserHooks/useRecomendedUsername';
import { AUTH_TEXT } from '@/app/constants/app-toast-texts';
import { TermsOfUse } from './TermsOfUse';
import { AuthInput } from '@defaults/AuthInput';

const FinishSignUpLayout: FC = () => {
	const { signUpFinish, isLoading } = useRegisterPhaseTwo();
	const { ref } = useParams();
	const { data } = useRecomendedUsername(ref);

	const [userState, setUserState] = useState({
		username: '',
		password: '',
		confirmPassword: '',
		ref: '',
	});
	const navigate = useNavigate();

	useEffect(() => {
		setUserState((prev: any) => ({
			...prev,
			ref: ref || '',
			username: data ? data?.recommended_username || '' : '',
		}));
	}, [ref, data]);

	const handleChange = (field: string, value: any) => {
		setUserState((prevUserState) => ({
			...prevUserState,
			[field]: value,
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
		signUpFinish(requestParams).then((user: any) => {
			if (user) {
				if (user?.accessRole == 'user') navigate('/');
				if (user?.accessRole == 'admin') navigate('/admin');
				if (user?.accessRole == 'provider') navigate('/provider/profile');
			}
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="input-group">
				<input
					value={userState.username}
					onChange={(e) => handleChange('username', e.target.value)}
					type="text"
					placeholder="Username"
					required
				/>
			</div>
			<AuthInput
				setVal={(val) => handleChange('password', val)}
				type="password"
				placeholder="Password"
				required
			/>
			<AuthInput
				setVal={(val) => handleChange('confirmPassword', val)}
				type="password"
				placeholder="Confirm Password"
				required
			/>

			<PasswordRequirements password={userState.password} />
			<TermsOfUse />
			<div className="margin-top">
				<PrimaryButton
					text="Proceed"
					type="submit"
					isDisabled={isLoading}
					click={handleSubmit}
					className="center"
				/>
			</div>
		</form>
	);
};

export default FinishSignUpLayout;
