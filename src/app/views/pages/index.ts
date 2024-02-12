import { lazy } from 'react';

export * from './auth'


export const Dashboard = lazy(() => import('./panel/layouts/dashboard/Dashboard'))
export const WebApplication = lazy(() => import('./panel/layouts/web/WebApplication'))
export const MobileApplication = lazy(() => import('./panel/layouts/mobile/MobileApplicationPanel'))
export const CloudApplicationPanel = lazy(() => import('./panel/layouts/cloud/Cloud'))
export const LanApplicationPanel = lazy(() => import('./panel/layouts/lan/Lan'))
export const EnpPanel = lazy(() => import('./panel/layouts/enp/EnpPanel'))
export const EnpSingle = lazy(() => import('./panel/layouts/enp/EnpSingle'))
export const SourceCodePanel = lazy(() => import('./panel/layouts/sourcecode/SourceCodePanel'))
export const SocialEngineeringPanel = lazy(() => import('./panel/layouts/social/SocialEngineeringPanel'))
export const SupportPanel = lazy(() => import('./panel/layouts/support/SupportPanel'))
export const PreferencePanel = lazy(() => import('./panel/layouts/preferences/PreferencePanel'))
export const InxPanel = lazy(() => import('./panel/layouts/inx/InxPanel'))
export const SnsPanel = lazy(() => import('./panel/layouts/sns/SnsPanel'))
export const VdbPanel = lazy(() => import('./panel/layouts/vdb/VdbPanel'))
export const AdminUser = lazy(() => import('./panel/layouts/admin/layouts/AdminUser'))
export const AdminPage = lazy(() => import('./panel/layouts/admin/AdminPage'))
export const AdminCompany = lazy(() => import('./panel/layouts/admin/layouts/AdminCompany'))
export const IssuePage = lazy(() => import('./panel/layouts/issues/IssuePage'))
export const IssuesCreation = lazy(() => import('./panel/layouts/issues/layouts/IssuesCreation'))
export const IssuesPanel = lazy(() => import('./panel/layouts/issues/layouts/IssuesPanel'))
export const IssuesUpdate = lazy(() => import('./panel/layouts/issues/layouts/IssuesUpdate'))
