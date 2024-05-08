import { type FC, Fragment, useContext, useEffect, useMemo } from 'react';
import { ChatBoxType, type Ticket } from '../../../../../../data';
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
import { useParams } from 'react-router';

export const SupportChatDisplay: FC = () => {
	const { getOneTicket, isLoading, refetch } = useOneTicket();
	const { dad } = useParams();
	const selectedTicketID = useContext(SelectedTicket);

	useEffect(() => {
		refetch(dad || selectedTicketID || '0');
	}, [selectedTicketID]);

	const childTicket = (): Ticket[] =>
		getOneTicket() ? getOneTicket()?.childs || [] : [];

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
								<Show when={Boolean(getOneTicket())}>
									<MessageCard
										selectedID={getOneTicket()?.user_id || ''}
										body={getOneTicket()?.cs_body || ''}
										username={getOneTicket()?.user_username! || ''}
										createdAt={getOneTicket()?.creacion || ''}
									/>
								</Show>

								{childTicket().map((ticket: Ticket, i: number) => (
									<Fragment key={`tk-${ticket.id}-${i}`}>
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
