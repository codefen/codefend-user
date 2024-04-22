import { type FC } from 'react';
import {
	ScopeOption,
	type OrderOffensive,
	type OrderTeamSize,
} from '../../../../../../data';
import useModal from '#commonHooks/useModal';
import { BugIcon } from '@icons';
import { ProviderScope } from '@standalones/order-scope/OrderScope';
import { OrderCardTemplate } from '@standalones/order-card-template/OrderCardTemplate';
import { IconTextPairs } from '@standalones/textpair/IconTextPairs';
import { PrimaryButton } from '@buttons/index';
import Show from '@defaults/Show';
import { useQualitySurveyStore } from '@stores/qualitySurvey.store';
import '../../providers/components/ordercards.scss';

export interface ConfirmOrderCardProps {
	sizeOrder: OrderTeamSize | 'small' | 'medium' | 'full';
	offensive: OrderOffensive | 'careful' | 'offensive' | 'adversary';
	type: string;
	provider: string;
	scope: ScopeOption | 0 | 1;
	price: string;
	handleActivate: (id: string) => void;
	id: string;
	isSelected?: boolean;
	resourcesScope: any;

	conditionReview: string;
	conditionProvider: string;
	conditionFinancial: string;
	referenceNumber: string;
}

export const UserOrderCard: FC<ConfirmOrderCardProps> = ({
	sizeOrder,
	offensive,
	type,
	provider,
	scope,
	price,
	id,
	isSelected,
	handleActivate,
	resourcesScope,
	conditionReview,
	conditionProvider,
	conditionFinancial,
	referenceNumber,
}) => {
	const { showModal, setShowModal } = useModal();
	const { updateIsOpen, updateOrderId, updateReferenceNumber } =
		useQualitySurveyStore();
	const resources = `all ${scope == ScopeOption.ALL ? 'company' : type} resources`;

	const handleOpenPoll = () => {
		updateIsOpen(true);
		updateOrderId(id);
		updateReferenceNumber(referenceNumber);
	};

	return (
		<>
			<ProviderScope
				isOpen={showModal}
				scope={resourcesScope}
				onClose={() => setShowModal(false)}
				viewConfirm={false}
				onConfirm={() => {}}
			/>
			<OrderCardTemplate
				id={id}
				handleActivate={handleActivate}
				isSelected={Boolean(isSelected)}
				offensive={offensive}
				price={price}
				provider={provider}
				sizeOrder={sizeOrder}
				state="Finished"
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
							onClick={() => setShowModal(true)}>
							view scope
						</span>
					</IconTextPairs>
				}>
				<div className="provider-order-main-content flex-col">
					<div className="order-price-dist expand">
						<span className="current-extend">
							Financial state: {conditionFinancial}
						</span>

						<span className="current-extend">
							Provider state: {conditionProvider}
						</span>
					</div>
					<Show
						when={
							conditionProvider === 'finished' &&
							conditionReview === 'unreviewed'
						}>
						<PrimaryButton
							text="Start the survey"
							buttonStyle="red"
							click={handleOpenPoll}
							disabledLoader
						/>
					</Show>
				</div>
			</OrderCardTemplate>
		</>
	);
};
