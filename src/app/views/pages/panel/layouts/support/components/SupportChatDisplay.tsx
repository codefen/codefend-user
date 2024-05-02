import { type FC, Fragment, useContext, useEffect, useMemo } from 'react';
import {
	ChatBoxType,
	type Ticket,
	generateIDArray,
	type TicketWithChild,
} from '../../../../../../data';
import {
	ChatBox,
	MessageCard,
	PageLoader,
	SimpleSection,
} from '../../../../../components';
import SelectedTicket from '../supportProvider';
import Show from '@defaults/Show.tsx';
import { MessageIcon } from '@icons';
import { useOneTicket } from '@panelHooks/support/useOneTicket';
import { toast } from 'react-toastify';

export const SupportChatDisplay: FC = () => {
	const { getOneTicket, isLoading, refetch } = useOneTicket();
	const selectedTicketID = useContext(SelectedTicket);

	useEffect(() => {
		if (selectedTicketID.trim().length !== 0) {
			refetch(selectedTicketID);
		}
	}, [selectedTicketID]);

	const childTicket = (): Ticket[] =>
		getOneTicket() ? getOneTicket()?.childs || [] : [];

	const ticketKeys = useMemo(() => {
		return childTicket() ? generateIDArray(childTicket().length) : [];
	}, [childTicket]);

	const onDone = () => {
		const viewMessage = localStorage.getItem('viewMessage')
			? JSON.parse(localStorage.getItem('viewMessage') as string)
			: { view: true };
		refetch(selectedTicketID);
		if (viewMessage.view) {
			toast.success(
				'We aim to respond to your queries within 24 to 48 hours.',
			);
			localStorage.setItem('viewMessage', JSON.stringify({ view: false }));
		}
	};
	return (
		<>
			<div className="card messages">
				<SimpleSection
					header={getOneTicket()?.cs_header || ''}
					icon={<MessageIcon />}>
					<div className="content">
						<Show when={!isLoading} fallback={<PageLoader />}>
							<div
								className={`messages-wrapper ${
									childTicket().length > 3 && 'item'
								}`}>
								<MessageCard
									selectedID={getOneTicket()?.user_id || ''}
									body={getOneTicket()?.cs_body || ''}
									username={getOneTicket()?.user_username! || ''}
									createdAt={getOneTicket()?.creacion || ''}
								/>

								{childTicket().map((ticket: Ticket, i: number) => (
									<Fragment key={ticketKeys[i]}>
										<MessageCard
											selectedID={ticket.user_id || ''}
											body={ticket.cs_body || ''}
											username={ticket.user_username || ''}
											createdAt={ticket.creacion || ''}
										/>
									</Fragment>
								))}
							</div>
						</Show>
					</div>
				</SimpleSection>

				<ChatBox
					type={ChatBoxType.SUPPORT}
					onDone={onDone}
					selectedID={selectedTicketID}
				/>
			</div>
		</>
	);
};
