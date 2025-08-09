import { type FC, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useOneIssue } from '@panelHooks/issues/useOneIssue.ts';
import { IssueChatDisplay } from '../components/IssueChatDisplay.tsx';
import IssueUpdatePanel from '../components/IssueUpdatePanel.tsx';
import { PageLoader } from '@/app/views/components/loaders/Loader.tsx';
import Show from '@/app/views/components/Show/Show.tsx';
import { useShowScreen } from '#commonHooks/useShowScreen.ts';
import Navbar from '@/app/views/components/navbar/Navbar';
import { useMediaQuery } from 'usehooks-ts';

const IssueUpdate: FC = () => {
  const { getIssue, isLoading, refetchOne } = useOneIssue();
  const [showScreen, control, _refresh] = useShowScreen();
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Debug logs
  useEffect(() => {
    console.log('🔍 [DEBUG] IssuesUpdate - showScreen:', showScreen);
    console.log('🔍 [DEBUG] IssuesUpdate - window.innerWidth:', window.innerWidth);
    console.log('🔍 [DEBUG] IssuesUpdate - isLoading:', isLoading);
    console.log('🔍 [DEBUG] IssuesUpdate - getIssue:', getIssue);
  }, [showScreen, isLoading, getIssue]);

  useEffect(() => {
    refetchOne(id as string);
    return () => {
      localStorage.removeItem('viewMessage');
    };
  }, [control]);

  // Funcionalidad de swipe para mobile
  useEffect(() => {
    if (!isMobile || !mainRef.current) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;

      // Verificar swipe horizontal de izquierda a derecha
      // Mínimo 100px de distancia horizontal y menos de 100px vertical
      if (
        deltaX > 100 &&
        Math.abs(deltaY) < 100 &&
        Math.abs(deltaX) > Math.abs(deltaY)
      ) {
        // Swipe de izquierda a derecha detectado - navegar al índice
        navigate('/issues');
      }

      touchStartRef.current = null;
    };

    const mainElement = mainRef.current;
    mainElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    mainElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      mainElement.removeEventListener('touchstart', handleTouchStart);
      mainElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, navigate]);

  return (
    <main ref={mainRef} className={`issue-detail ${showScreen ? 'actived' : ''}`}>
      <Show when={showScreen} fallback={<PageLoader />}>
        <section className="left">
          <IssueUpdatePanel issueData={getIssue} isLoading={isLoading} />
        </section>
        <section className="right">
          <Navbar />
          <IssueChatDisplay id={id || '0'} />
        </section>
      </Show>
    </main>
  );
};

export default IssueUpdate;
