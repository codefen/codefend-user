import { type FC } from 'react';
import './credentialcard.scss';

interface TestingCredentialProps {
	username: string;
	password: string;
	accessLVL: string;
	info: string;
	hideBorderBottom?: boolean;
	viewInfo: () => void;
}

export const TestingCredentialCard: FC<TestingCredentialProps> = (props) => {
	return (
		<div
			className={`testing-cred ${props.hideBorderBottom && 'hide-border'}`}>
			<div className="avatar">
				<img src="/codefend/user-icon.svg" alt="profile-icon" />
				<span>{props?.accessLVL || ''}</span>
			</div>
			<div className="info">
				<div className="text">
					<span>username:</span>
					<span>password:</span>
					<span className="extra-info-cred">Extra info:</span>
				</div>
				<div className="text">
					<span>{props?.username || ''}</span>
					<span>{props?.password || ''}</span>
					<span
						className="codefend-text-red extra-info-cred extra-info-btn"
						onClick={props.viewInfo}>
						View info...
					</span>
				</div>
			</div>
		</div>
	);
};