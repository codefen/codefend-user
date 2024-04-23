import { type FC } from 'react';
import {
	ScopeOption,
	calculateDaysDifference,
	formatReverseDate,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../../data';
import { IconTextPairs, PrimaryButton } from '../../../../../../components';
import { BugIcon } from '@icons';
import '../ordercards.scss';
import { useProviderOrderFinish } from '@userHooks/providers/useProviderOrderFinish';
import { OrderCardTemplate } from '../../../../../../components/standalones/order-card-template/OrderCardTemplate';
import useOrderScopeStore from '@stores/orderScope.store';

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
	removeOrder: (id: string) => void;
	id: string;
	isSelected?: boolean;
	resourcesScope: any;
}

export const CurrentOrderCard: FC<ConfirmOrderCardProps> = ({
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
	removeOrder,
	finishDate,
	resourcesScope,
}) => {
	const { updateOpen, updateScope, updateViewConfirm } = useOrderScopeStore();
	const finishOrder = useProviderOrderFinish();

	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
	const handleOpenScope = () => {
		updateOpen(true);
		updateScope(resourcesScope);
		updateViewConfirm(false);
	};
	return (
		<OrderCardTemplate
			id={id}
			handleActivate={handleActivate}
			isSelected={Boolean(isSelected)}
			offensive={offensive}
			price={price}
			provider={provider}
			sizeOrder={sizeOrder}
			state="Current"
			type={type}
			viewPrice
			viewScope={
				<IconTextPairs
					icon={<BugIcon className="codefend-text-red" />}
					className="icon-text">
					<span className="text-bold">Resources:</span>
					<span className="text-light border">{resources}</span>
					<span
						className="codefend-text-red all-scope"
						onClick={handleOpenScope}>
						view scope
					</span>
				</IconTextPairs>
			}>
			<div className="provider-order-main-content flex-col">
				<div className="order-price-dist expand">
					<span className="current-extend">
						{calculateDaysDifference(finishDate)} Days left -
						{formatReverseDate(finishDate)}
					</span>

					<span className="current-extend m-t-auto">
						Distributor: {distributor}
					</span>
				</div>
				<div className="flex-row buttons move-to-right">
					<PrimaryButton
						click={() => {
							finishOrder(id);
							removeOrder(id);
						}}
						text="Finish order"
						buttonStyle="red"
						className="btn-order-card"
					/>
				</div>
			</div>
		</OrderCardTemplate>
	);
};
