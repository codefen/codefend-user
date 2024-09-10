import { type FC, Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { PageLoader } from '@defaults/loaders/Loader.tsx';
import Show from '@defaults/Show.tsx';
import './issues.scss';

const IssuePage: FC = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const tinyMCE = document.createElement('script');
    tinyMCE.src = '/editor-lib/visual/mce/tinymce.min.js';
    tinyMCE.async = true;
    const onScriptLoad = () => setScriptLoaded(true);

    // Añado el evento y agrego el evento de onload
    tinyMCE.addEventListener('load', onScriptLoad);
    document.head.appendChild(tinyMCE);

    return () => {
      tinyMCE.removeEventListener('load', onScriptLoad);
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
