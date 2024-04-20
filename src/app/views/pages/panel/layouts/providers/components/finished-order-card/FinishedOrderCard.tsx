import { type FC } from 'react';
import {
	ScopeOption,
	calculateDaysDifference,
	formatReverseDate,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../../data';
import useModal from '#commonHooks/useModal';
import { IconTextPairs, PrimaryButton } from '../../../../../../components';
import { BugIcon } from '@icons';
import '../ordercards.scss';
import { ProviderScope } from '@standalones/order-scope/OrderScope';
import { useProviderOrderFinish } from '@userHooks/providers/useProviderOrderFinish';

export interface ConfirmOrderCardProps {
	sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
	offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
	type: string;
	provider: string;
	scope: ScopeOption | 0 | 1;
	distributor: string;
	price: string;
	finishDate: string;
	handleActivate: (id: string) => void;
	id: string;
	isSelected?: boolean;
	resourcesScope: any;
}

export const FinishOrderCard: FC<ConfirmOrderCardProps> = ({
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
	finishDate,
	resourcesScope,
}) => {
	const { showModal, setShowModal } = useModal();
	const onClick = () => handleActivate(id);

	const teamSize = sizeOrder.valueOf();
	const offensiveOrder = `${offensive.valueOf()} pentest`;
	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
	return (
		<>
			<ProviderScope
				isOpen={showModal}
				scope={resourcesScope}
				onClose={() => setShowModal(false)}
				viewConfirm={false}
			/>
			<div
				className={`confirm-order-card ${isSelected && 'active'}`}
				onClick={onClick}>
				<div className="provider-order-info flex-col">
					<h2>
						<span className="codefend-text-red">New</span>
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
							<span
								className="codefend-text-red all-scope"
								onClick={() => setShowModal(true)}>
								view scope
							</span>
						</IconTextPairs>
						<IconTextPairs
							icon={<BugIcon className="codefend-text-red" />}
							className="icon-text">
							<span className="text-bold">Price:</span>{' '}
							<span className="text-light">${price}</span>
						</IconTextPairs>
					</div>
				</div>
				<div className="provider-order-main-content flex-col">
					<div className="order-price-dist expand">
						<span className="current-extend">
							Finish date {formatReverseDate(finishDate)}
						</span>

						<span className="current-extend m-t-auto">
							Distributor: {distributor}
						</span>
					</div>
				</div>
			</div>
		</>
	);
};
