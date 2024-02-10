import React, { useState } from 'react';
// import ModalWrapper from '../../modalComponents/ModalWrapper';
import { orderTab } from '../../../../data/mocks';

// components
import ScopeView from './ScopeView';
import FrequencyView from './FrequencyView';
import TeamSize from './TeamSize';
import OrderReview from './OrderReview';
import PaymentMethod from './PaymentMethod';

// style
import './order.scss';

const Order = ({ closeModal }: { closeModal: Function }) => {
	const [activeTab, setActiveTab] = useState<any>(orderTab[0]);

	return (
		<div
			onClick={(e) => {
				if (e.currentTarget === e.target) {
					closeModal();
				}
			}}
			className="absolute flex items-center justify-center w-full h-full bg-black/10 left-0">
			<div className="bg-white order">
				<div className="order-header">
					<img
						src="/codefend/pentest-header-vector.svg"
						alt="header-icon"
					/>
					<span>Execute a new pentest</span>
				</div>
				<div className="tabs">
					{orderTab.map((tab, orderIndex) => (
						<span
							onClick={() => {
								if (tab === activeTab) return;
								setActiveTab(tab);
							}}
							key={orderIndex}
							className={`tab ${activeTab === tab && 'selected'}`}>
							{tab}
						</span>
					))}
				</div>
				<div className="content">
					{activeTab === 'scope' && (
						<ScopeView
							setActiveTab={setActiveTab}
							closeModal={closeModal}
						/>
					)}
					{activeTab === 'frequency' && (
						<FrequencyView setActiveTab={setActiveTab} />
					)}
					{activeTab === 'team size' && (
						<TeamSize setActiveTab={setActiveTab} />
					)}
					{activeTab === 'order review' && (
						<OrderReview setActiveTab={setActiveTab} />
					)}
					{activeTab === 'payment method' && (
						<PaymentMethod
							setActiveTab={setActiveTab}
							closeModal={closeModal}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Order;
