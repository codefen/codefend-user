import { useState, type FC } from 'react';
import {
	ScopeOption,
	formatNumber,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../../data';
import useModal from '#commonHooks/useModal';
import { IconTextPairs, ModalWrapper } from '../../../../../../components';
import { BugIcon } from '@icons';
import Show from '@defaults/Show';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import { useProviderConfirm } from '@userHooks/providers/useProviderConfirm.ts';
import { useProviderRefuseOrder } from '@userHooks/providers/useProviderRefuseOrder';
import { useProviderRefuseStore } from '@stores/providerOrder.store';
import '../ordercards.scss';
import { ProviderScope } from '@standalones/order-scope/OrderScope';
import { OrderCardTemplate } from '../order-card-template/OrderCardTemplate';

export interface ConfirmOrderCardProps {
	sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
	offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
	type: string;
	provider: string;
	scope: ScopeOption | 0 | 1;
	distributor: string;
	price: string;
	handleActivate: (id: string) => void;
	removeOrder: (id: string) => void;
	id: string;
	isSelected?: boolean;
	resourcesScope: any;
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
	removeOrder,
	resourcesScope,
}) => {
	const { showModal, setShowModal } = useModal();
	const { cancelConfirm } = useProviderRefuseOrder();
	const { confirmOrder, isLoading } = useProviderConfirm();
	const { setClickRefuse, setOrderId, isRefusing } = useProviderRefuseStore();
	const onClick = () => handleActivate(id);

	const handleClickRefuse = () => {
		cancelConfirm();
		setClickRefuse(true);
		setOrderId(id);
	};

	const handleConfirm = () => {
		removeOrder(id);
		confirmOrder(id);
		setShowModal(false);
	};
	const teamSize = sizeOrder.valueOf();
	const offensiveOrder = `${offensive.valueOf()} pentest`;
	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
	return (
		<>
			<ProviderScope
				isOpen={showModal}
				scope={resourcesScope}
				onClose={() => setShowModal(false)}
				onConfirm={handleConfirm}
				viewConfirm
			/>
			<OrderCardTemplate
				id={id}
				handleActivate={handleActivate}
				isSelected={Boolean(isSelected)}
				offensive={offensive}
				price={price}
				provider={provider}
				sizeOrder={sizeOrder}
				state="New"
				type={type}>
				<div className="provider-order-main-content flex-col">
					<div className="order-price-dist">
						<span className="price">${formatNumber(price)}</span>
						<span className="distributor">
							distributor: {distributor}
						</span>
					</div>
					<div className="flex-row buttons">
						<button
							className="btn-decline"
							disabled={isRefusing}
							onClick={handleClickRefuse}>
							refuse order
						</button>
						<PrimaryButton
							click={() => setShowModal(true)}
							text="Confirm order"
							buttonStyle="red"
							className="btn-order-card"
							isDisabled={isLoading}
						/>
					</div>
				</div>
			</OrderCardTemplate>
		</>
	);
};
