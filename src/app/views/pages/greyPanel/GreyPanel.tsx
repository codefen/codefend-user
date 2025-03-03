import { NewHeader } from '@/app/components/NewHeader/NewHeader';
import { FlashLightProvider } from '@/app/views/context/FlashLightContext';
import { Loader } from '@defaults/index';
import MobileFallback from '@/app/components/mobile-fallback/MobileFallback';
import useKeyEventPress from '@stores/keyEvents';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useMediaQuery } from 'usehooks-ts';

export const GreyPanel = () => {
  const _location = useLocation();
  const _keyPress = useKeyEventPress();
  const matches = useMediaQuery('(min-width: 1175px)');

  useEffect(() => {}, []);

  if (!matches) {
    return <MobileFallback />;
  }
  return (
    <FlashLightProvider>
      <div>
        <NewHeader />
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
    </FlashLightProvider>
  );
};
