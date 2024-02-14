import { lazy } from 'react';

export * from './defaults'
export * from './icons';
export * from './modals';
export * from './Table';
export * from './standalones';
export * from './defaults';
export * from './Table';
export * from './buttons';
export * from './Table/tablev2';

export const Navbar = lazy(
	() => import('../../views/components/standalones/navbar/Navbar'),
);
export const Sidebar = lazy(
	() => import('../../views/components/standalones/sidebar/Sidebar'),
);
export const ErrorConection = lazy(
	() => import('../../views/components/modals/ErrorConection'),
);
