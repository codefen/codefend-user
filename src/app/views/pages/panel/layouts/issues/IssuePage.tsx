import { type FC, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import './issues.scss';
import { addEventListener } from '@utils/helper';
import { EVENTS } from '@/app/constants/events';

const IssuePage: FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const tinyMCE = document.createElement('script');
    tinyMCE.src = '/editor-lib/visual/mce/tinymce.min.js';
    tinyMCE.async = true;
    tinyMCE.defer = true;

    // Añado el evento y agrego el evento de onload
    document.head.appendChild(tinyMCE);
    const loadUnSub = addEventListener(tinyMCE, EVENTS.LOAD, () => {
      setScriptLoaded(true);
    });

    return () => {
      loadUnSub();
      document.head.removeChild(tinyMCE);
    };
  }, []);

  return (
    <>
      <Show when={scriptLoaded} fallback={<PageLoader />}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </Show>
    </>
  );
};

export default IssuePage;
