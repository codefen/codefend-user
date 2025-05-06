import { useEffect, useState, type FC } from 'react';
import { SupportChatDisplay } from './components/SupportChatDisplay';
import { SupportTicketList } from './components/SupportTicketList';
import { useAllTicket } from '@panelHooks/support/useAllTickets.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Show from '@/app/views/components/Show/Show.tsx';
import './support.scss';
import { useParams } from 'react-router';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { AddNewTicketBox } from '@/app/views/pages/panel/layouts/support/components/AddNewTicketBox';

const SupportPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { getTikets, isLoading, refetch } = useAllTicket();
  const { dad } = useParams();
  const selectedTicket = useGlobalFastField('selectedTicket');

  useEffect(() => {
    refetch();
  }, [control]);

  useEffect(() => {
    const tickets = getTikets();

    if (dad) {
      const ticket = tickets.find(ticket => ticket.id === dad);
      if (ticket) {
        selectedTicket.set(ticket);
      } else {
        if (tickets.length > 0) {
          selectedTicket.set(tickets[0]);
        } else {
          selectedTicket.set(null);
        }
      }
    } else {
      const current = selectedTicket.get;
      if (!current) {
        if (tickets.length > 0) {
          selectedTicket.set(tickets[0]);
        } else {
          selectedTicket.set(null);
        }
      } else {
        // Verificar que el actual todavía esté en la lista
        const stillExists = tickets.some(ticket => ticket.id === current.id);
        if (!stillExists) {
          if (tickets.length > 0) {
            selectedTicket.set(tickets[0]);
          } else {
            selectedTicket.set(null);
          }
        }
      }
    }
  }, [dad, getTikets()]);
  return (
    <>
      <main className={`support ${showScreen ? 'actived' : ''}`}>
        <section className="left">
          <Show when={selectedTicket.get !== null}>
            <SupportChatDisplay selectedTicket={selectedTicket.get} />
          </Show>
        </section>
        <section className="right">
          <AddNewTicketBox />
          <SupportTicketList isLoading={isLoading} tickets={getTikets()} refresh={refresh} />
        </section>
      </main>
    </>
  );
};

export default SupportPanel;
