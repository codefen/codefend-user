import { Suspense } from 'react';
import { useRoutes, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/app/views/components/loaders/Loader';
import { useUserRole } from '#commonUserHooks/useUserRole.ts';
import {
  ConfirmationSignUp,
  Dashboard,
  WebApplication,
  MobileApplication,
  SocialEngineeringPanel,
  SupportPanel,
  PreferencePanel,
  AdminPage,
  AdminCompany,
  ResellerLeadsLayout,
  ResellerUsersLayout,
  LanPage,
  ProviderPage,
  ProfileProviderLayout,
  OrdersReviewProviders,
  ResellerCompaniesLayout,
  ResellerOrdersLayout,
  SnsPanel,
} from '../views/pages';
import AdminLanders from '../views/pages/panel/layouts/admin/layouts/AdminLanders';
import AdminCommander from '../views/pages/panel/layouts/admin/layouts/AdminCommander';
import { PanelPage } from '../views/pages/panel/PanelPage';
import {
  IssuePage,
  IssuesCreation,
  IssuesPanel,
  IssuesUpdate,
} from '../views/pages/panel/layouts/issues';
import InxPanel from '../views/pages/panel/layouts/inx/InxPanel';
import { PasswordRecovery } from '../views/pages/auth/newLayouts/NewPasswordRecovery/PasswordRecoveryPage';
import { TermsAndCondition } from '../views/pages/help-center/TermsAndCondition';
import { HelpCenter } from '../views/pages/help-center/HelpCenter';
import { SecurityAndPrivacyPolicy } from '../views/pages/help-center/SecurityAndPrivacyPolicy';
import { HelpNotfound } from '../views/pages/help-center/HelpNotfound';
import { PageReport } from '@modals/reports/PageReport.tsx';
import ProtectedRoute from './ProtectedRoute';
import { ScansPage } from '@/app/views/pages/panel/layouts/scans/ScansPage';
import { NewAuthPage } from '@/app/views/pages/auth/NewAuthPage';
import { NewSignupForm } from '@/app/views/pages/auth/newLayouts/NewSignupForm/NewSignupForm';
import { NewSigninForm } from '@/app/views/pages/auth/newLayouts/NewSigninForm/NewSigninForm';
import { TeamMembersPage } from '@/app/views/pages/panel/layouts/team-members/TeamMembersPage';
import { UserProfilePage } from '@/app/views/pages/panel/layouts/user-profile/UserProfile';
import { NewSignupInvitation } from '@/app/views/pages/auth/newLayouts/NewSignupInvitation/NewSignupInvitation';
import { OrdersPaymentsPage } from '@/app/views/pages/panel/layouts/orders-payments/OrdersPaymentsPage';
import { OnboardingPage } from '@/app/views/pages/auth/onboarding/OnboardingPage';
import TestGoogleContacts from '@/app/views/pages/TestGoogleContacts';
import TestGoogleRegistration from '@/app/views/pages/TestGoogleRegistration';
import TestGoogleDebug from '@/app/views/pages/TestGoogleDebug';
import TestGoogleTokens from '@/app/views/pages/test-google-tokens';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useEffect } from 'react';

export const AppRouter = () => {
  const { isAdmin, isProvider, isReseller, isNormalUser } = useUserRole();
  const companies = useGlobalFastField('companies');
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Codefend';
    if (path === '/dashboard') title = 'Codefend: dashboard';
    else if (path === '/team-members') title = 'Codefend: members';
    else if (path === '/user-profile') title = 'Codefend: profile';
    else if (path === '/orders-payments') title = 'Codefend: orders';
    else if (path === '/web') title = 'Codefend: surface/web';
    else if (path === '/network') title = 'Codefend: surface/wan';
    else if (path === '/social') title = 'Codefend: surface/social';
    else if (path === '/issues') title = 'Codefend: issues/index';
    else if (/^\/issues\/[0-9]+$/.test(path)) title = 'Codefend: issues/view';
    else if (path.startsWith('/ai-surveillance')) title = 'Codefend: ai surveillance';
    else if (path === '/sns') title = 'Codefend: leaks explorer';
    else if (path === '/ask-a-hacker') title = 'Codefend: ask a hacker';
    document.title = title;
  }, [location]);

  const isProviderWithAccess =
    isProvider() && companies.get?.length > 0 && companies.get?.[0] !== null;
  const haveAccessToResources = !isProvider() && !isReseller();
  const haveAccessToSupport = !isProvider() && !isReseller();
  const haveAccessToCreateIssue = isProvider() || isAdmin();
  const allRolesLoggedIn = isProvider() || isReseller() || isAdmin() || isNormalUser();

  const routes = useRoutes([
    {
      path: '/',
      element: <PanelPage />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute isAllowed={true}>
              {isAdmin() ? (
                <AdminCompany />
              ) : isProvider() ? (
                <Navigate to="/provider/profile" replace />
              ) : isReseller() ? (
                <Navigate to="/reseller/leads" replace />
              ) : (
                <Dashboard />
              )}
            </ProtectedRoute>
          ),
        },
        // Admin routes
        {
          path: 'admin/*',
          element: (
            <ProtectedRoute isAllowed={isAdmin() || isProviderWithAccess}>
              <AdminPage />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="company" replace /> },
            { path: 'company', element: <AdminCompany /> },

            { path: 'landers', element: <AdminLanders /> },
            { path: 'commander', element: <AdminCommander /> },
          ],
        },
        // Provider routes
        {
          path: 'provider/*',
          element: (
            <ProtectedRoute isAllowed={isProvider()}>
              <ProviderPage />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Navigate to="profile" replace /> },
            { path: 'profile', element: <ProfileProviderLayout /> },
            { path: 'profile/:view', element: <ProfileProviderLayout /> },
            { path: 'orders', element: <OrdersReviewProviders /> },
            { path: 'orders/:view', element: <OrdersReviewProviders /> },
          ],
        },
        // Reseller routes
        {
          path: 'reseller/*',
          element: (
            <ProtectedRoute isAllowed={isReseller()}>
              <Outlet />
            </ProtectedRoute>
          ),
          children: [
            { path: 'leads', element: <ResellerLeadsLayout /> },
            { path: 'users', element: <ResellerUsersLayout /> },
            { path: 'companies', element: <ResellerCompaniesLayout /> },
            { path: 'orders', element: <ResellerOrdersLayout /> },
          ],
        },
        // Shared routes
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: 'user-profile',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <UserProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'team-members',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <TeamMembersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: 'ask-a-hacker',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <SupportPanel />
            </ProtectedRoute>
          ),
        },
        {
          path: 'orders-payments',
          element: (
            <ProtectedRoute isAllowed={haveAccessToResources}>
              <OrdersPaymentsPage />
            </ProtectedRoute>
          ),
        },
        // Resource routes
        ...(haveAccessToResources || isProviderWithAccess
          ? [
              { path: 'web', element: <WebApplication /> },
              { path: 'mobile', element: <MobileApplication /> },
              /*{ path: 'cloud', element: <CloudApplicationPanel /> },*/
              /*{ path: 'source', element: <SourceCodePanel /> },*/
              { path: 'network', element: <LanPage /> },
              { path: 'social', element: <SocialEngineeringPanel /> },
              {
                path: 'issues/*',
                element: <IssuePage />,
                children: [
                  { index: true, element: <IssuesPanel /> },
                  {
                    path: 'create',
                    element: (
                      <ProtectedRoute isAllowed={haveAccessToCreateIssue}>
                        <IssuesCreation />
                      </ProtectedRoute>
                    ),
                  },
                  { path: 'create/:type/:resourceId', element: <IssuesCreation /> },
                  { path: 'create/:type', element: <IssuesCreation /> },
                  { path: ':id', element: <IssuesUpdate /> },
                ],
              },
              {
                path: 'ai-surveillance/:domain?',
                element: <ScansPage />,
              },
              // Legacy routes for backward compatibility
              {
                path: 'scans',
                element: <ScansPage />,
              },
              {
                path: 'web-surveillance/:domain?',
                element: <ScansPage />,
              },
            ]
          : []),
        // Non-reseller routes
        ...(!isReseller()
          ? [
              { path: 'inx', element: <InxPanel /> },
              { path: 'sns', element: <SnsPanel /> },
            ]
          : []),
        // Support routes
        ...(haveAccessToSupport
          ? [
              { path: 'cs', element: <SupportPanel /> },
              { path: 'cs/:dad', element: <SupportPanel /> },
              { path: 'preferences', element: <PreferencePanel /> },
            ]
          : []),
      ],
    },
    // Report route
    {
      path: 'report/*',
      element: (
        <ProtectedRoute isAllowed={allRolesLoggedIn}>
          <PageReport />
        </ProtectedRoute>
      ),
    },
    // Public routes
    {
      path: 'help/*',
      element: <HelpCenter />,
      children: [
        { path: 'terms-and-condition', element: <TermsAndCondition /> },
        { path: 'security-and-privacy-policy', element: <SecurityAndPrivacyPolicy /> },
        { path: '*', element: <HelpNotfound /> },
      ],
    },
    {
      path: 'auth/*',
      element: <NewAuthPage />,
      children: [
        { index: true, element: <Navigate to="signin" replace /> },
        { path: 'signup', element: <NewSignupForm /> },
        { path: 'signup/:ref', element: <NewSignupForm /> },
        { path: 'signin', element: <NewSigninForm /> },
        { path: 'signup/invitation', element: <NewSignupInvitation /> },
        { path: 'signup/invitation/:ref', element: <NewSignupInvitation /> },
        { path: 'confirmation', element: <ConfirmationSignUp /> },
        { path: 'recovery', element: <PasswordRecovery /> },
        { path: 'recovery/:ref', element: <PasswordRecovery /> },
        { path: 'onboarding', element: <OnboardingPage /> },
      ],
    },
    // Test route for Google Contacts
    {
      path: '/test-google-contacts',
      element: <TestGoogleContacts />,
    },
    // Test route for Google Registration
    {
      path: '/test-google-registration',
      element: <TestGoogleRegistration />,
    },
    // Test route for Google Debug
    {
      path: '/test-google-debug',
      element: <TestGoogleDebug />,
    },
    // Test route for Google Tokens
    {
      path: '/test-google-tokens',
      element: <TestGoogleTokens />,
    },
  ]);

  return <Suspense fallback={<Loader />}>{routes}</Suspense>;
};
