import React from 'react';
import { ModalWrapper } from '.';
import { ErrorIcon, PrimaryButton, SecondaryButton } from '..';

const ErrorConection: React.FC<{ closeModal: () => void }> = (props) => {
	return (
		<>
			<ModalWrapper isErrorBox={true} action={props.closeModal}>
				<div
					className="error-wrapper"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<div className="header-wrapper">
						<ErrorIcon />
						<h2>Connection error.</h2>
					</div>
					<p className="leading-6">
						This application is unable to establish a connection with the
						specified backend server. This may be due to scheduled
						technical maintenance or an issue with your connection. Please
						consider the following steps:
					</p>
					<ol className="my-6 list-decimal ml-4">
						<li>Ensure that your internet connection is functional.</li>
						<li>Review the API connection variables.</li>
					</ol>
					<p className="leading-6">
						Should the issue persist and you require assistance, please
						contact offline@codefend.com.
					</p>
					<p className="mt-6">
						We apologize for any inconvenience this may have caused.
					</p>
					<div className="error-buttons ">
						<SecondaryButton
							text="Try again"
							click={(e: any) => {
								props.closeModal();
								window.location.reload();
							}}
							className="btn-cancel codefend_secondary_ac"
						/>
						<PrimaryButton
							text="email offline@codefend.com"
							click={() => {}}
							className="btn-add codefend_main_ac"
						/>
					</div>
				</div>
			</ModalWrapper>
		</>
	);
};

export default ErrorConection;
