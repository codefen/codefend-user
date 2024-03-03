import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TertiaryButton } from '../buttons/tertiary/TertiaryButton';
import { ModalWrapper, NetworkIcon, NetworkSetingModal, Show } from '..';

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	isNetworkOpen: boolean;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, isNetworkOpen: false };
	}

	override componentDidCatch(error: Error, info: ErrorInfo) {
		//Runs when catching an error
		this.setState({ hasError: true });
	}

	updateHasError = () => {
		this.setState({ hasError: !this.state.hasError });
	};

	updateNetworkOpen = () => {
		this.setState({ isNetworkOpen: !this.state.isNetworkOpen });
	};

	override render() {
		if (this.state.hasError) {
			//Renders the alternative error message
			return (
				<>
					<Show when={this.state.isNetworkOpen}>
						<ModalWrapper action={() => this.updateNetworkOpen()}>
							<div
								className="modal-wrapper-title internal-tables disable-border"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}>
								<div className="network-modal-container">
									<div className="network-modal-content disable-border">
										<NetworkSetingModal
											close={() => this.updateNetworkOpen()}
										/>
									</div>
								</div>
							</div>
						</ModalWrapper>
					</Show>
					<div
						className="network-btn"
						onClick={() => this.updateNetworkOpen()}>
						<NetworkIcon width={1.5} height={1.5} />
					</div>
					<div className="error-boundry">
						<header>
							<h2 className="error-boundry-title">
								¡Oops! Something went wrong.
							</h2>
							<p className="error-boundry-text">
								Sorry, an unexpected error occurred and we were unable
								to display the content, you can go back
							</p>
						</header>

						<TertiaryButton
							text="Go back"
							className="error-tertiary-btn"
							click={() => {
								this.updateHasError();
								window.history.back();
							}}
						/>
					</div>
				</>
			);
		}
		// Render normal child components
		return this.props.children;
	}
}
