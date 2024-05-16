import type { FC } from 'react';
import './passwordrequirements.scss';
import {
	hasLowerCase,
	hasMinChars,
	hasSpecialChar,
	hasStrNumber,
	hasUpperCase,
} from '@/app/constants/validations';

interface PasswordRequirementsProps {
	password: string;
}

export const PasswordRequirements: FC<PasswordRequirementsProps> = ({
	password,
}) => (
	<div className="password-req-container">
		<span className="password-req-title">Password requirements</span>
		<div className="password-req-list">
			<span className="password-req-item">
				<span>*</span>{' '}
				<small>
					<div
						className={`dashed-item ${hasUpperCase(password) ? 'strike' : 'no-strike'}`}></div>
					At least 1 uppercase character
				</small>
			</span>
			<span className="password-req-item">
				<span>*</span>{' '}
				<small>
					<div
						className={`dashed-item ${hasLowerCase(password) ? 'strike' : 'no-strike'}`}></div>
					At least 1 lowercase character
				</small>
			</span>
			<span className="password-req-item">
				<span>*</span>{' '}
				<small>
					<div
						className={`dashed-item ${hasStrNumber(password) ? 'strike' : 'no-strike'}`}></div>
					At least 1 number
				</small>
			</span>
			<span className="password-req-item">
				<span>*</span>{' '}
				<small>
					<div
						className={`dashed-item ${hasSpecialChar(password) ? 'strike' : 'no-strike'}`}></div>
					At least one special character
				</small>
			</span>
			<span className="password-req-item">
				<span>*</span>{' '}
				<small>
					{' '}
					<div
						className={`dashed-item ${hasMinChars(password, 12) ? 'strike' : 'no-strike'}`}></div>
					At least 12 characters
				</small>
			</span>
		</div>
	</div>
);
