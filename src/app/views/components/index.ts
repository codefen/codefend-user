import { lazy } from 'react';

export * from './icons';
export * from './modals';
export * from './Table/TableWithoutActions';
export * from './buttons';
export * from './Table/tablev2';

export const Navbar = lazy(() => import('./navbar/Navbar'));
export const Sidebar = lazy(() => import('./sidebar/Sidebar'));
export const ErrorConection = lazy(() => import('./modals/ErrorConnection'));
export { NetworkVisualization } from './NetworkVisualization/NetworkVisualization';
export { WorldMapView } from './NetworkVisualization/WorldMapView';
