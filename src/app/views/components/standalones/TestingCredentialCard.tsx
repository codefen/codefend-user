import React from 'react';

interface TestingCredentialProps {
	username?: string;
	password?: string;
	accessLVL?: string;
	hideBorderBottom: boolean;
}
5;

export const TestingCredentialCard: React.FC<TestingCredentialProps> = (
	props,
) => {
	return (
		<div
			className={`testing-cred ${props.hideBorderBottom ?? 'hide-border'}`}>
			<div className="avatar">
				<img src="/codefend/user-icon.svg" alt="profile-icon" />
			</div>
			<div className="info">
				<div className="icons">
					<span>username:</span>
					<span>password:</span>
					<span>access lvl:</span>
				</div>
				<div className="text">
					<span>{props?.username ?? ''}</span>
					<span>{props?.password ?? ''}</span>
					<span>{props?.accessLVL ?? ''}</span>
				</div>
			</div>
		</div>
	);
};
