import { Suspense } from 'react';
import { Outlet } from 'react-router';

export const HelpCenter = () => (
  <Suspense>
    <Outlet />
  </Suspense>
);
