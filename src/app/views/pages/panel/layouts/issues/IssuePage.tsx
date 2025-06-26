import { type FC, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { PageLoader } from '@/app/views/components/loaders/Loader';
import Show from '@/app/views/components/Show/Show';
import './issues.scss';
import { addEventListener } from '@utils/helper';
import { EVENTS } from '@/app/constants/events';
import { useUserRole } from '#commonUserHooks/useUserRole';

const IssuePage: FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { isAdmin, isProvider } = useUserRole();

  useEffect(() => {
    const hasUserAdmin = isAdmin() || isProvider();
    if (!hasUserAdmin) {
      setScriptLoaded(true);
      return () => {};
    }
    const tinyMCE = document.createElement('script');
    tinyMCE.src = '/editor-lib/visual/mce/tinymce.min.js';
    tinyMCE.async = true;
    tinyMCE.defer = true;

    const loadUnSub = addEventListener(tinyMCE, EVENTS.LOAD, () => {
      setScriptLoaded(true);
    });
    document.head.appendChild(tinyMCE);

    return () => {
      loadUnSub();
      document.head.removeChild(tinyMCE);
    };
  }, []);

  return (
    <Show when={scriptLoaded} fallback={<PageLoader />}>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Show>
  );
};

export default IssuePage;
