import { useEffect, useState, type FC } from 'react';
import { SupportChatDisplay } from './components/SupportChatDisplay';
import { SupportTicketList } from './components/SupportTicketList';
import { useAllTicket } from '@panelHooks/support/useAllTickets.ts';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Show from '@/app/views/components/Show/Show.tsx';
import './support.scss';
import { useParams } from 'react-router';
import {
  useGlobalFastField,
  useGlobalFastFields,
} from '@/app/views/context/AppContextProvider.tsx';
import { AddNewTicketBox } from '@/app/views/pages/panel/layouts/support/components/AddNewTicketBox';
import { APP_EVENT_TYPE, USER_LOGGING_STATE } from '@interfaces/panel';
import { SupperEmptyDisplay } from '@/app/views/pages/panel/layouts/support/components/SupperEmptyDisplay';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

const SupportPanel: FC = () => {
  const [showScreen, control, refresh] = useShowScreen();
  const { getTikets, isLoading, refetch } = useAllTicket();
  const { dad } = useParams();
  const { selectedTicket, appEvent, userLoggingState } = useGlobalFastFields([
    'selectedTicket',
    'appEvent',
    'userLoggingState',
  ]);
  const isDesktop = useMediaQuery('(min-width: 1230px)');

  useEffect(() => {
    if (userLoggingState.get !== USER_LOGGING_STATE.LOGGED_OUT) {
      refetch();
      appEvent.set(APP_EVENT_TYPE.TICKETS_PAGE_CONDITION);
    }
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
      <main className={`support ${showScreen ? 'actived' : ''} ${!isDesktop ? 'sidebar-mobile-active' : ''}`}>
        <section className="left">
          {/* Cards móviles - se muestran solo en móvil */}
          <div className="mobile-cards">
            {/* Card "New question" */}
            <AddNewTicketBox />
          </div>

          <Show when={selectedTicket.get !== null} fallback={<SupperEmptyDisplay />}>
            <SupportChatDisplay selectedTicket={selectedTicket.get} />
          </Show>

          {/* Tickets - se muestran solo en móvil */}
          <div className="mobile-bottom-card">
            <SupportTicketList isLoading={isLoading} tickets={getTikets()} refresh={refresh} />
          </div>
        </section>
        <section className="right">
          <Navbar />
          <AddNewTicketBox />
          <SupportTicketList isLoading={isLoading} tickets={getTikets()} refresh={refresh} />
        </section>
      </main>
    </>
  );
};

export default SupportPanel;
