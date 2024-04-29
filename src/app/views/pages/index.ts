import { lazy } from 'react';

export * from './auth';

export const Dashboard = lazy(() => import('./panel/layouts/dashboard/Dashboard.tsx'))
export const WebApplication = lazy(() => import('./panel/layouts/web/WebApplication.tsx'))
export const MobileApplication = lazy(() => import('./panel/layouts/mobile/MobileApplicationPanel.tsx'))
export const CloudApplicationPanel = lazy(() => import('./panel/layouts/cloud/Cloud.tsx'))
export const LanPage = lazy(() => import('./panel/layouts/lan/Lan.tsx'))
export const EnpPanel = lazy(() => import('./panel/layouts/enp/EnpPanel.tsx'))
export const EnpSingle = lazy(() => import('./panel/layouts/enp/EnpSingle.tsx'))
export const SourceCodePanel = lazy(() => import('./panel/layouts/sourcecode/SourceCodePanel.tsx'))
export const SocialEngineeringPanel = lazy(() => import('./panel/layouts/social/SocialEngineeringPanel.tsx'))
export const SupportPanel = lazy(() => import('./panel/layouts/support/SupportPanel.tsx'))
export const PreferencePanel = lazy(() => import('./panel/layouts/preferences/PreferencePanel.tsx'))
export const InxPanel = lazy(() => import('./panel/layouts/inx/InxPanel.tsx'))
export const SnsPanel = lazy(() => import('./panel/layouts/sns/SnsPanel.tsx'))
export const VdbPanel = lazy(() => import('./panel/layouts/vdb/VdbPanel.tsx'))
export const AdminUser = lazy(() => import('./panel/layouts/admin/layouts/AdminUser.tsx'))
export const AdminPage = lazy(() => import('./panel/layouts/admin/AdminPage.tsx'))
export const AdminCompany = lazy(() => import('./panel/layouts/admin/layouts/AdminCompany.tsx'))

export const ResellerLeadsLayout= lazy(() => import('./panel/layouts/reseller/layouts/ResellerLeadsLayout.tsx'))
export const ResellerUsersLayout= lazy(() => import('./panel/layouts/reseller/layouts/ResellerUsersLayout.tsx'))
export const ResellerCompaniesLayout= lazy(() => import('./panel/layouts/reseller/layouts/ResellerCompaniesLayout.tsx'))
export const ResellerOrdersLayout= lazy(() => import('./panel/layouts/reseller/layouts/ResellerOrdersLayout.tsx'))

export const ProviderPage= lazy(() => import('./panel/layouts/providers/ProviderPanel.tsx'))
export const ProfileProviderLayout= lazy(() => import('./panel/layouts/providers/layouts/profile-provider/ProfileProviderLayout.tsx'))
export const OrdersReviewProviders = lazy(() => import('./panel/layouts/providers/layouts/orders-provider/OrdersProviderLayout.tsx'))

/* export const IssuePage = lazy(() => import('./panel/layouts/issues/IssuePage'))
export const IssuesCreation = lazy(() => import('./panel/layouts/issues/layouts/IssuesCreation'))
export const IssuesPanel = lazy(() => import('./panel/layouts/issues/layouts/IssuesPanel'))
export const IssuesUpdate = lazy(() => import('./panel/layouts/issues/layouts/IssuesUpdate'))
 */