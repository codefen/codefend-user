import { type FC, useContext, useEffect, useRef } from 'react';
import { ChatBoxType, type Ticket } from '../../../../../../data';
import { ChatBox, PageLoader, SimpleSection } from '../../../../../components';
import SelectedTicket from '../supportProvider';
import Show from '@defaults/Show.tsx';
import { MessageIcon } from '@icons';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { MessageList } from './MessageList';
import { useSWRMessage } from '@panelHooks/useSWRTickets';
import { useUserData } from '#commonUserHooks/useUserData';
import { EMPTY_TICKET_WITHCHILD } from '@mocks/empty';

export const SupportChatDisplay: FC = () => {
	const { getCompany } = useUserData();
	const { dad } = useParams();
	const selectedTicketID = useContext(SelectedTicket);
	const { data, isLoading, mutate } = useSWRMessage(
		dad || selectedTicketID || '0',
		getCompany(),
	);

	const onDone = (newMessage?: any) => {
		const viewMessage = localStorage.getItem('viewMessage')
			? JSON.parse(localStorage.getItem('viewMessage') as string)
			: { view: true };

		if (newMessage) {
			/* mutate(`${getCompany()}-${selectedTicketID}-cs`, {
				populateCache: true,
				optimisticData: data,
			});*/
			mutate({ ...data, childs: [...data.childs, newMessage] });
		}

		if (viewMessage.view) {
			toast.success(
				'We aim to respond to your queries within 24 to 48 hours.',
			);
			localStorage.setItem('viewMessage', JSON.stringify({ view: false }));
		}
	};

	const { childs, ...ticketDad } = data ? data : EMPTY_TICKET_WITHCHILD;
	childs.unshift(ticketDad as Ticket);

	return (
		<>
			<div className="card messages">
				<SimpleSection header={ticketDad.cs_header} icon={<MessageIcon />}>
					<div className="content">
						<Show when={!isLoading} fallback={<PageLoader />}>
							<MessageList tickets={childs} />
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
