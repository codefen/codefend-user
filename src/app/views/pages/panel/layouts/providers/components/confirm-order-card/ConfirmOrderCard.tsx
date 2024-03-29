import {
	ScopeOption,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../../data';
import {
	BugIcon,
	IconTextPairs,
	PrimaryButton,
} from '../../../../../../components';
import './confirorder.scss';
import type { FC } from 'react';

export interface ConfirmOrderCardProps {
	sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
	offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
	type: string;
	provider: string;
	scope: ScopeOption | 0 | 1;
	distributor: string;
	price: string;
	handleActivate: (id: string) => void;
	id: string;
	isSelected?: boolean;
}

export const ConfirmOrderCard: FC<ConfirmOrderCardProps> = ({
	sizeOrder,
	offensive,
	type,
	provider,
	scope,
	distributor,
	price,
	id,
	isSelected,
	handleActivate,
}) => {
	const teamSize = sizeOrder.valueOf();
	const offensiveOrder = `${offensive.valueOf()} pentest`;
	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
	const onClick = () => handleActivate(id);
	return (
		<div
			className={`confirm-order-card ${isSelected && 'active'}`}
			onClick={onClick}>
			<div className="provider-order-info flex-col">
				<h2>
					<span className="codefend-text-red">
						New {teamSize} size orders:
					</span>
					<span className="text-dark">{offensiveOrder}</span>,{' '}
					<span className="normal">{type} pentest</span>
				</h2>
				<div className="order-important-info flex-col">
					<IconTextPairs
						icon={<BugIcon className="codefend-text-red" />}
						className="icon-text">
						<span className="text-bold">Offensivness:</span>{' '}
						<span className="text-light">{offensiveOrder}</span>
					</IconTextPairs>
					<IconTextPairs
						icon={<BugIcon className="codefend-text-red" />}
						className="icon-text">
						<span className="text-bold">Order size:</span>
						<span className="text-light">{teamSize} allocation</span>
					</IconTextPairs>
					<IconTextPairs
						icon={<BugIcon className="codefend-text-red" />}
						className="icon-text">
						<span className="text-bold">Profesional:</span>{' '}
						<span className="text-light">@{provider}</span>
					</IconTextPairs>
					<IconTextPairs
						icon={<BugIcon className="codefend-text-red" />}
						className="icon-text">
						<span className="text-bold">Resources:</span>
						<span className="text-light border">{resources}</span>
						<span className="codefend-text-red all-scope">
							view scope
						</span>
					</IconTextPairs>
				</div>
			</div>
			<div className="provider-order-main-content flex-col">
				<div className="order-price-dist">
					<span className="price">${price}</span>
					<span className="distributor">distributor: {distributor}</span>
				</div>
				<div className="flex-row buttons">
					<button className="btn-decline">refuse order</button>
					<PrimaryButton
						text="Confirm order"
						buttonStyle="red"
						disabledLoader
						className="btn-order-card"
					/>
				</div>
			</div>
		</div>
	);
};
