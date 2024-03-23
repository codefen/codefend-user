import { type FC } from 'react';
import { ModalWrapper } from '.';
import { LanIcon, PrimaryButton, SecondaryButton } from '..';
import {
	type NetworkSettingState,
	useNetworkSettingState,
} from '../../../data';

const ErrorConection: FC<{ closeModal: () => void }> = (props) => {
	const { setNetworkSettingState } = useNetworkSettingState(
		(state: NetworkSettingState) => state,
	);
	return (
		<>
			<ModalWrapper isErrorBox={true} action={props.closeModal}>
				<div
					className="error-wrapper"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}>
					<div className="error-content">
						<div className="header-wrapper">
							<span className="codefend-text-red">
								<LanIcon width="2.5rem" height="2.5rem" />
							</span>
							<h2>Connection error.</h2>
						</div>
						<p className="light-p">
							<strong>
								This application is unable to establish a connection
								with the specified backend server.
							</strong>
							This may be due to scheduled technical maintenance or an
							issue with your connection. Please consider the following
							steps:
						</p>
						<ol className="action-list">
							<li>
								Ensure that your internet connection is functional.
							</li>
							<li>Review the API connection variables.</li>
						</ol>
						<p>
							Should the issue persist and you require assistance, please
							contact{' '}
							<a
								className="codefend-text-red"
								href="mailto:offline@codefend.com"
								target="_blank">
								<strong>offline@codefend.com.</strong>
							</a>
						</p>
					</div>
					<p className="apologies-p">
						<strong>
							We apologize for any inconvenience this may have caused.
						</strong>
					</p>
					<div className="error-buttons ">
						<SecondaryButton
							text="Go to Network Settings"
							click={(e: any) => {
								props.closeModal();
								setNetworkSettingState(true);
								// window.location.reload();
							}}
							className="btn-cancel codefend_secondary_ac"
						/>
						<PrimaryButton
							text="email offline@codefend.com"
							click={() =>
								window.open(
									'mailto:' +
										encodeURIComponent('offline@codefend.com'),
								)
							}
							className="btn-add codefend_main_ac"
						/>
					</div>
				</div>
			</ModalWrapper>
		</>
	);
};

export default ErrorConection;
