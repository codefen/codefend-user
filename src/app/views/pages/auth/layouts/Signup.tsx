import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../../components';
import { companySizesList } from '../../../../data';
import { countries, topCountriesOnList } from '@/app/constants/countries';
import { AuthInput } from '@defaults/AuthInput';
import { useRegisPhaseOne } from '@userHooks/auth/useRegisPhaseOne';
import { useDefineUserReseller } from '@userHooks/auth/useDefineUserReseller';
import { TermsOfUse } from './TermsOfUse';

const SignUpLayout = () => {
	const navigate = useNavigate();
	const {
		signUpUser,
		isLoading,
		givenName,
		familyName,
		email,
		phone,
		company,
		companyWeb,
		companyRole,
		companySize,
		idiom,
	} = useRegisPhaseOne();
	const {
		updateResellerArea,
		updateReseller,
		resellers,
		companyCountry,
		reseller,
	} = useDefineUserReseller();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		signUpUser(companyCountry, reseller.name, reseller.id).then(
			(isSuccess): any => {
				if (isSuccess) navigate('/auth/confirmation');
			},
		);
	};

	return (
		<form onSubmit={handleSubmit}>
			<AuthInput
				ref={givenName}
				placeholder="First name"
				autoComplete="given-name"
				required
			/>
			<AuthInput
				ref={familyName}
				placeholder="Last name"
				autoComplete="family-name"
				required
			/>
			<AuthInput
				ref={email}
				type="email"
				autoComplete="email"
				placeholder="Email"
				required
			/>
			<AuthInput
				ref={phone}
				type="tel"
				placeholder="Phone number"
				required
			/>
			<AuthInput ref={company} placeholder="Company Name" required />
			<AuthInput ref={companyWeb} placeholder="example.com" required />

			<div className="input-group">
				<select
					ref={companySize}
					className="log-inputs log-text"
					defaultValue=""
					name="company_size"
					required>
					<option value="" disabled hidden>
						Select Company Size
					</option>
					{companySizesList.map((company, i) => (
						<option key={`cs-${i}`} value={company.value}>
							{company.label}
						</option>
					))}
				</select>
			</div>

			<div className="input-group">
				<select
					ref={companyRole}
					id="social-data"
					defaultValue={''}
					className="log-inputs log-text"
					required>
					<option value="" hidden>
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
					required>
					<option value="" hidden>
						Select your country
					</option>
					{Array.from(countries).map((country: any) => (
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
					defaultValue=""
					value={
						topCountriesOnList.includes(companyCountry) ? '' : reseller.id
					}
					disabled={
						topCountriesOnList.includes(companyCountry) ? true : false
					}
					required>
					<option value="" hidden>
						{topCountriesOnList.includes(companyCountry)
							? 'Holool Albilad LLC'
							: 'Reseller'}
					</option>
					{resellers.map((reseller) => (
						<option key={reseller.id} value={reseller.id}>
							{reseller.name}
						</option>
					))}
				</select>
			</div>

			<div className="input-group">
				<select
					ref={idiom}
					id="social-data"
					defaultValue=""
					className="log-inputs log-text"
					required>
					<option value="" hidden>
						Idiom
					</option>
					<option value="ar">Arabic</option>
					<option value="en">English</option>
				</select>
			</div>

			<TermsOfUse />

			<div className="extra-group">
				<PrimaryButton
					text="Proceed"
					isDisabled={isLoading}
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
