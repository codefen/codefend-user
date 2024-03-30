import { type FC, useEffect, useState } from 'react';
import { PageLoader, PrimaryButton, Show } from '../../..';
import {
	OrderSection,
	OrderTeamSize,
	useOrderPlan,
	useOrderStore,
} from '../../../../../data';

interface PricePlans {
	small: string;
	full: string;
	medium: string;
}
export const TeamSizeOrderModal: FC = () => {
	const { teamSize, updateState, referenceNumber } = useOrderStore(
		(state) => state,
	);

	const [teamSizeW, setTeamSize] = useState<OrderTeamSize>(teamSize);
	const [currentPrices, setCurrentPrices] = useState<PricePlans | null>(null);
	const { getCurrentPrices, sendPlanTeamSize } = useOrderPlan();

	useEffect(() => {
		getCurrentPrices(referenceNumber).then((res) => {
			setCurrentPrices({
				small: res.plans_prices.small,
				medium: res.plans_prices.medium,
				full: res.plans_prices.full,
			});
		});
	}, []);

	const nextStep = () => {
		const chosenPrice = currentPrices
			? currentPrices[teamSizeW.valueOf() as keyof typeof currentPrices]
			: '';

		sendPlanTeamSize(teamSizeW, chosenPrice, referenceNumber);
		updateState('teamSize', teamSizeW);
		updateState('orderStepActive', OrderSection.ORDER_REVIEW);
	};

	const TeamSizeLoader = () => (
		<div>
			<h2 className="order-plan-loader-title">
				Retrieving current prices from the system
			</h2>
			<PageLoader />
		</div>
	);

	return (
		<Show when={currentPrices !== null} fallback={<TeamSizeLoader />}>
			<>
				<div className="step-header">
					<h3>
						<b>We will size the task, please select the model.</b>
						<span>
							Below you can see various options that will help us
							personalize your experience:
						</span>
					</h3>
				</div>

				<div className="step-content">
					<div
						className={`option order-pointer ${
							teamSizeW === OrderTeamSize.SMALL && `select-option`
						}`}
						onClick={() => setTeamSize(OrderTeamSize.SMALL)}>
						<h4 className="price-value">${currentPrices?.small}</h4>

						<div className="order-snapshot">
							<div className="top">
								<h5 className="alt-color">Small allocation:</h5>
							</div>
							<span className="one-pentest">
								a multidisciplinary team of professional hackers
								exclusively reviewing your case.
							</span>
						</div>
					</div>
					<div
						className={`option order-pointer ${
							teamSizeW === OrderTeamSize.MID && `select-option`
						}`}
						onClick={() => setTeamSize(OrderTeamSize.MID)}>
						<h4 className="price-value">
							${currentPrices?.medium}
						</h4>

						<div className="order-snapshot">
							<div className="top">
								<h5 className="alt-color">Medium allocation:</h5>
							</div>
							<span className="one-pentest">
								a multidisciplinary team of professional hackers
								exclusively reviewing your case.
							</span>
						</div>
					</div>
					<div
						className={`option order-pointer ${
							teamSizeW === OrderTeamSize.FULL && `select-option`
						}`}
						onClick={() => setTeamSize(OrderTeamSize.FULL)}>
						<h4 className="price-value">${currentPrices?.full}</h4>

						<div className="order-snapshot">
							<div className="top">
								<h5 className="alt-color">Full team allocation:</h5>
							</div>
							<span className="one-pentest">
								a multidisciplinary team of professional hackers
								exclusively reviewing your case.
							</span>
						</div>
					</div>
				</div>

				<div className="button-wrapper next-btns">
					<div className="secondary-container">
						<PrimaryButton
							text="Back"
							click={(e: any) =>
								updateState('orderStepActive', OrderSection.FREQUENCY)
							}
							className="full"
							buttonStyle="black"
							disabledLoader
						/>
					</div>
					<div className="primary-container">
						<PrimaryButton
							text="Continue to the next step"
							click={nextStep}
							className="full"
							buttonStyle="red"
						/>
					</div>
				</div>
			</>
		</Show>
	);
};
