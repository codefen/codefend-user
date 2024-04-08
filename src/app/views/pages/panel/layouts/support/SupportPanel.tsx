import { useEffect, useState, type FC } from 'react';
import { SupportChatDisplay } from './components/SupportChatDisplay';
import { SupportTicketList } from './components/SupportTicketList';
import { useAllTicket } from '@panelHooks/support/useSupport';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Show from '@defaults/Show.tsx';
import SelectedTicket from './supportProvider.ts';
import './support.scss';

const SupportPanel: FC = () => {
	const [showScreen, control, refresh] = useShowScreen();
	const [selectedTicket, setSelectedTicket] = useState<string>('');
	const { getTikets, isLoading, refetch } = useAllTicket();

	useEffect(() => {
		if (!isLoading && Boolean(getTikets().length)) {
			setSelectedTicket(getTikets()[0].id);
		}
	}, [getTikets(), isLoading]);

	useEffect(() => {
		refetch();
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
						tickets={getTikets()}
						refresh={refresh}
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
