import { useState, type FC } from 'react';
import {
	ScopeOption,
	formatNumber,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../../data';
import useModal from '#commonHooks/useModal';
import {
	ConfirmModal,
	IconTextPairs,
	ModalTitleWrapper,
	ModalWrapper,
} from '../../../../../../components';
import { BugIcon } from '@icons';
import Show from '@defaults/Show';
import { PrimaryButton } from '@buttons/primary/PrimaryButton';
import './confirorder.scss';
import { useProviderConfirm } from '@userHooks/providers/useProviderConfirm.ts';
import { useProviderRefuseOrder } from '@userHooks/providers/useProviderRefuseOrder';
import { useProviderRefuseStore } from '@stores/providerOrder.store';

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
	const { showModal, setShowModal } = useModal();
	const { cancelConfirm } = useProviderRefuseOrder();
	const { confirmOrder, isLoading, requestId } = useProviderConfirm();
	const { setClickRefuse, setOrderId, isRefusing } = useProviderRefuseStore();
	const onClick = () => handleActivate(id);

	const handleClickRefuse = () => {
		cancelConfirm();
		setClickRefuse(true);
		setOrderId(id);
	};

	const teamSize = sizeOrder.valueOf();
	const offensiveOrder = `${offensive.valueOf()} pentest`;
	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;
	return (
		<>
			<Show when={showModal}>
				<ModalWrapper action={() => setShowModal(false)}>
					<div>
						<h2>This is scope</h2>
					</div>
				</ModalWrapper>
			</Show>
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
							<span
								className="codefend-text-red all-scope"
								onClick={() => setShowModal(true)}>
								view scope
							</span>
						</IconTextPairs>
					</div>
				</div>
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
							click={() => confirmOrder(id)}
							text="Confirm order"
							buttonStyle="red"
							className="btn-order-card"
							isDisabled={isLoading && requestId == 'confirmOrder'}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
