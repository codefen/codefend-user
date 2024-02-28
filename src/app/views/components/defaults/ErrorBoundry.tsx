import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TertiaryButton } from '../buttons/tertiary/TertiaryButton';
import { ModalWrapper, NetworkSetingModal, Show } from '..';

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
								<div className="w-full mt-4">
									<div className="w-full px-8 disable-border">
										<NetworkSetingModal
											close={() => this.updateNetworkOpen()}
										/>
									</div>
								</div>
							</div>
						</ModalWrapper>
					</Show>
					<div className="flex flex-col justify-center items-center w-full h-full gap-y-4">
						<h2 className="text-3xl font-bold text-white truncate my-3">
							¡Ups! Algo salió mal.
						</h2>
						<div className="moon relative w-[13rem] aspect-square bg-red-500 rounded-full">
							<div className="moon-dif absolute top-[17%] right-[13%] rounded-full w-[4.5rem] aspect-square bg-opacity-50 filter-bg-rug"></div>
						</div>

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
