import { type FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../../components';
import {
	type RegisterParams,
	companySizesList,
	countries,
	defaultCountries,
} from '../../../../data';
import { useRegisterAction } from '#commonUserHooks/useRegisterAction';
import { useFindResellerArea } from '#commonUserHooks/useFindResellerArea';

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
	reseller: { id: string; name: string };
	idiom: string;
}

const SignUpLayout: FC = () => {
	const { signUpUser } = useRegisterAction();
	const navigate = useNavigate();
	const [resellers, findResellers] = useFindResellerArea();
	const [isLoading, setLoading] = useState<boolean>(false);

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
		reseller: { id: '', name: '' },
		idiom: '',
	});

	const updateResellerArea = (e: any) => {
		setSignupForm((current: any) => ({
			...current,
			companyCountry: e.target.value,
		}));
		const country = defaultCountries.find(
			(country) => country.name == e.target.value,
		);
		findResellers(country ? country.alpha2Code : '');
	};

	const updateReseller = (e: any) => {
		setSignupForm((current: any) => ({
			...current,
			reseller: JSON.parse(e.target.value),
		}));
	};

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
			reseller_name: signupForm.reseller.name,
			reseller_id: signupForm.reseller.id,
			idiom: signupForm.idiom,
			phase: '1',
		};
		signUpUser(requestParams)
			.then((isSuccess): any => {
				if (isSuccess) navigate('/auth/confirmation');
			})
			.finally(() => setLoading(false));
	};

	return (
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
					placeholder="Email"
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
					type="text"
					onChange={(e) =>
						setSignupForm((current: any) => ({
							...current,
							companyWeb: e.target.value,
						}))
					}
					name="company_website"
					placeholder="https://example.com"
					pattern="(https?://.*\..*)|(.*\..*)|(*.*)"
					size={60}
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
					<option value="" disabled hidden>
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
				<select
					onChange={(e) =>
						setSignupForm((prevData) => ({
							...prevData,
							companyRole: e.target.value,
						}))
					}
					id="social-data"
					defaultValue={''}
					className="log-inputs log-text"
					required>
					<option value="" disabled hidden>
						role
					</option>
					<option value="admin">administrative</option>
					<option value="human">human resources</option>
					<option value="info">information tech</option>
					<option value="ads">marketing</option>
					<option value="sales">sales</option>
					<option value="finance">finance</option>
					<option value="cs">customer service</option>
					<option value="prod">production & ops</option>
					<option value="plan">strategy & planning</option>
					<option value="law">legal affairs</option>
				</select>
			</div>

			<div className="input-group">
				<select
					id="countries"
					name="country"
					onChange={updateResellerArea}
					className="log-inputs log-text"
					value={signupForm.companyCountry}
					required>
					<option value="" disabled hidden>
						Select your country
					</option>
					{Array.from(countries).map((country) => (
						<option key={country.value} value={country.value}>
							{country.label}
						</option>
					))}
				</select>
			</div>
			<div className="input-group">
				<select
					id="resellers"
					name="reseller"
					onChange={updateReseller}
					className="log-inputs log-text"
					value={JSON.stringify(signupForm.reseller)}
					required>
					<option
						value={JSON.stringify({ id: '', name: '' })}
						disabled
						hidden>
						Reseller
					</option>
					{Array.from(resellers).map((reseller) => (
						<option key={reseller.id} value={JSON.stringify(reseller)}>
							{reseller.name}
						</option>
					))}
				</select>
			</div>

			<div className="input-group">
				<select
					onChange={(e) =>
						setSignupForm((prevData) => ({
							...prevData,
							idiom: e.target.value,
						}))
					}
					id="social-data"
					defaultValue={''}
					className="log-inputs log-text"
					required>
					<option value="" disabled hidden>
						Idiom
					</option>
					<option value="ar">Arabic</option>
					<option value="en">English</option>
				</select>
			</div>

			<div className="extra-group">
				<span className="link link-color">
					I have read and accept the{' '}
					<Link to="/help/security-and-privacy-policy" target="_blank">
						<u>security-and-privacy-policy</u>
					</Link>{' '}
					and{' '}
					<Link to="/help/terms-and-condition" target="_blank">
						<u>Terms of Use.</u>
					</Link>
				</span>
			</div>
			<div className="extra-group">
				<PrimaryButton
					text="Proceed"
					isDisabled={isLoading}
					click={() => {}}
					type="submit"
					className="signin-btn"
				/>
				<div className="extra-group text-center">
					<Link
						to="/auth/signup/invitation"
						className="link codefend-text-red link-underline">
						Are you coming by invitation? Sign up here!
					</Link>
				</div>
				<div className="extra-group text-center low-space">
					<Link
						to="/auth/signin"
						className="link codefend-text-red link-underline">
						Already have an account? Sign in
					</Link>
				</div>
			</div>
		</form>
	);
};

export default SignUpLayout;
