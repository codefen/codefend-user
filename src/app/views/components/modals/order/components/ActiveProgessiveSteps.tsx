import React from 'react';
import { OrderSection } from '../../../../../data';
import { StepItem } from './StepItem';

interface ActiveProgressLineProps {
	isNextStep: boolean;
	orderStepActive: OrderSection;
}

export const ActiveProgressLine: React.FC<ActiveProgressLineProps> = ({
	isNextStep,
	orderStepActive,
}) => {
	const currentOrCompleted = (current: OrderSection, verify: OrderSection) => {
		if (verify === current) return 'current';
		return verify < current ? 'completed' : '';
	};

	if (isNextStep || orderStepActive > OrderSection.PAYMENT) return <></>;
	if (orderStepActive <= OrderSection.ORDER_REVIEW)
		return (
			<div className="steps">
				<StepItem
					text="Scope"
					styles={currentOrCompleted(orderStepActive, OrderSection.SCOPE)}
				/>
				<StepItem
					text="Frequency"
					styles={currentOrCompleted(
						orderStepActive,
						OrderSection.FREQUENCY,
					)}
				/>
				<StepItem
					text="Team size"
					styles={currentOrCompleted(
						orderStepActive,
						OrderSection.TEAM_SIZE,
					)}
				/>
				<StepItem
					text="Order review"
					styles={currentOrCompleted(
						orderStepActive,
						OrderSection.ORDER_REVIEW,
					)}
				/>
			</div>
		);

	return (
		<div className="steps">
			<StepItem
				text="Profesional"
				styles={currentOrCompleted(
					orderStepActive,
					OrderSection.SELECT_LEAD,
				)}
			/>
			<StepItem
				text="Environemnt"
				styles={currentOrCompleted(
					orderStepActive,
					OrderSection.ENVIRONMENT,
				)}
			/>
			<StepItem
				text="Additional info"
				styles={currentOrCompleted(
					orderStepActive,
					OrderSection.ADDITIONAL_INFO,
				)}
			/>
			<StepItem
				text="Payment"
				styles={currentOrCompleted(orderStepActive, OrderSection.PAYMENT)}
			/>
		</div>
	);
};
