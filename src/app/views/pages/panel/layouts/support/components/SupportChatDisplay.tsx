import { type FC, Fragment, useContext, useEffect, useMemo } from 'react';
import {
	ChatBoxType,
	type SupportProps,
	generateIDArray,
	useOneTicket,
} from '../../../../../../data';
import {
	ChatBox,
	MessageCard,
	MessageIcon,
	PageLoader,
	Show,
	SimpleSection,
} from '../../../../../components';
import SelectedTicket from '../supportProvider';

export const SupportChatDisplay: FC = () => {
	const { getOneTicket, isLoading, refetch } = useOneTicket();
	const selectedTicketID = useContext(SelectedTicket);

	useEffect(() => {
		if (selectedTicketID.trim().length !== 0) {
			refetch(selectedTicketID);
		}
	}, [selectedTicketID]);

	const ticketSelected = () =>
		getOneTicket() !== undefined
			? getOneTicket()
			: ({ csHeader: '' } as SupportProps);

	const childTicket = (): SupportProps[] => getOneTicket()?.childs ?? [];

	const ticketKeys = useMemo(() => {
		return childTicket() ? generateIDArray(childTicket().length) : [];
	}, [childTicket]);

	return (
		<>
			<div className="card messages">
				<SimpleSection
					header={ticketSelected().csHeader}
					icon={<MessageIcon />}>
					<div className="content">
						<Show when={!isLoading} fallback={<PageLoader />}>
							<>
								<div
									className={`messages-wrapper ${
										childTicket().length > 3 && 'item'
									}`}>
									<MessageCard
										selectedID={ticketSelected().userID ?? ''}
										body={ticketSelected()?.csBody ?? ''}
										username={ticketSelected()?.userUsername! ?? ''}
										createdAt={ticketSelected()?.createdAt! ?? ''}
									/>

									{childTicket().map(
										(ticket: SupportProps, i: number) => (
											<Fragment key={ticketKeys[i]}>
												<MessageCard
													selectedID={ticket.userID ?? ''}
													body={ticket.csBody ?? ''}
													username={ticket.userUsername ?? ''}
													createdAt={ticket.createdAt ?? ''}
												/>
											</Fragment>
										),
									)}
								</div>
							</>
						</Show>
					</div>
				</SimpleSection>

				<ChatBox
					type={ChatBoxType.SUPPORT}
					onDone={() => refetch(selectedTicketID)}
					selectedID={selectedTicketID}
				/>
			</div>
		</>
	);
};
