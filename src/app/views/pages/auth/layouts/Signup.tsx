import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { NetworkIcon, PrimaryButton } from '../../../components';
import {
	type RegisterParams,
	useAuthState,
	companySizesList,
	countries,
	type NetworkSettingState,
	useNetworkSettingState,
} from '../../../../data';

interface SignupForm {
	name: string;
	surname: string;
	companyRole: string;
	email: string;
	phone: string;
	companyName: string;
	companySize: string;
	companyWeb: string;
	companyCountry: string;
}

const SignUpLayout: FC = () => {
	const { signUpUser } = useAuthState();

	const navigate = useNavigate();

	const [signupForm, setSignupForm] = useState<SignupForm>({
		name: '',
		surname: '',
		companyRole: '',
		email: '',
		phone: '',
		companyName: '',
		companySize: '',
		companyWeb: '',
		companyCountry: '',
	});

	const [isLoading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const requestParams: RegisterParams = {
			lead_fname: signupForm.name,
			lead_lname: signupForm.surname,
			lead_role: signupForm.companyRole,
			lead_email: signupForm.email,
			lead_phone: signupForm.phone,
			company_name: signupForm.companyName,
			company_web: signupForm.companyWeb,
			company_size: signupForm.companySize,
			company_area: signupForm.companyCountry,
			phase: '1',
		};
		signUpUser(requestParams)
			.then((isSuccess): any => {
				if (isSuccess) navigate('/auth/confirmation');
			})
			.finally(() => setLoading(false));
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
				<div className="input-group">
					<input
						type="text"
						onChange={(e) =>
							setSignupForm((current: any) => ({
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
							setSignupForm((current: any) => ({
								...current,
								surname: e.target.value,
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
						type="email"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								email: e.target.value,
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
						type="tel"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								phone: e.target.value,
							}))
						}
						name="phone_number"
						placeholder="Phone number"
						required
					/>
				</div>

				<div className="input-group">
					<input
						type="text"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								companyName: e.target.value,
							}))
						}
						name="company_name"
						placeholder="Company Name"
						required
					/>
				</div>
				<div className="input-group">
					<input
						type="url"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								companyWeb: e.target.value,
							}))
						}
						name="company_website"
						placeholder="https://example.com"
						pattern="https://.*"
						size={30}
						required
					/>
				</div>
				<div className="input-group">
					<select
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								companySize: e.target.value,
							}))
						}
						className="log-inputs log-text"
						name="company_size"
						value={signupForm.companySize}
						required>
						<option value="" disabled>
							Select Company Size
						</option>
						{companySizesList.map((company) => (
							<option key={company.value} value={company.value}>
								{company.label}
							</option>
						))}
					</select>
				</div>
				<div className="input-group">
					<input
						type="text"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								companyRole: e.target.value,
							}))
						}
						name="company_role"
						placeholder="Company Role"
						required
					/>
				</div>

				<div className="input-group">
					<select
						id="countries"
						name="country"
						onChange={(e) =>
							setSignupForm((current: any) => ({
								...current,
								companyCountry: e.target.value,
							}))
						}
						className="log-inputs log-text"
						value={signupForm.companyCountry}
						required>
						<option value="" disabled>
							Select your country
						</option>
						{Array.from(countries).map((country) => (
							<option key={country.value} value={country.value}>
								{country.label}
							</option>
						))}
					</select>
				</div>

				<div className="extra-group">
					<span className="link link-color">
						I have read and accept the <u>Privacy Policy</u> and{' '}
						<u>Terms of Use.</u>
					</span>
				</div>
				<div className="extra-group">
					{/* <button
					disabled={isLoading}
					type="submit"
					className="btn btn-primary signup-button">
					{isLoading && <ButtonLoader />}
					proceed
				</button> */}

					<PrimaryButton
						text="Proceed"
						isDisabled={isLoading}
						click={() => {}}
						type="submit"
						className="signin-btn"
					/>

					<div className="extra-group text-center">
						<Link
							to="/auth/signin"
							className="link codefend-text-red link-underline">
							Already have an account? Sign in
						</Link>
					</div>
				</div>
			</form>
		</>
	);
};

export default SignUpLayout;
