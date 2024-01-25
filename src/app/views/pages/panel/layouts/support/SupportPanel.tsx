import React, { useEffect, useState } from 'react';
import { SupportChatDisplay } from './components/SupportChatDisplay';
import { SupportTicketList } from './components/SupportTicketList';
import { useAllTicket } from '../../../../../data';
import { Show } from '../../../../components';
import SelectedTicket from './supportProvider';
import './support.scss';

const SupportPanel: React.FC = () => {
	const [showScreen, setShowScreen] = useState(false);
	const [control, refresh] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<string>('');
	const { getTikets, isLoading, refetch } = useAllTicket();

	useEffect(() => {
		if (!isLoading && Boolean(getTikets().length)) {
			setSelectedTicket(getTikets()[0].id);
		}
	}, [getTikets(), isLoading]);

	useEffect(() => {
		refetch();
		const timeoutId = setTimeout(() => setShowScreen(true), 50);
		return () => clearTimeout(timeoutId);
	}, [control]);

	return (
		<SelectedTicket.Provider value={selectedTicket}>
			<main className={`support ${showScreen ? 'actived' : ''}`}>
				<section className="left">
					<SupportTicketList
						setSelectedTicket={(ticketID: string) =>
							setSelectedTicket(ticketID)
						}
						isLoading={isLoading}
						tickets={getTikets() ?? []}
						refresh={() => {
							refresh(!control);
						}}
					/>
				</section>
				<section className="right">
					<Show when={selectedTicket !== null}>
						<SupportChatDisplay />
					</Show>
				</section>
			</main>
		</SelectedTicket.Provider>
	);
};

export default SupportPanel;
